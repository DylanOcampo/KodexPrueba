import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, InputToolbox, SendButton } from "@chatscope/chat-ui-kit-react";
import { MessagePlaceHolder } from "./MessagePlaceHolder";
import { ElementContextThread } from "../context/ThreadContext";
import React, { useState, useEffect, useContext, useRef } from 'react';
import { TypingAni } from "./TypingAni";
import { AuthContext } from "../pages/AuthContext";


export const ChatBox = () => {

    const { Active, Title } = useContext(ElementContextThread);
    const { userData } = useContext(AuthContext);
    const [UserMessage, setUserMessage] = useState("");
    const [waiting, setWaiting] = useState(false);
    const [messages, setMessages] = useState([]);
    const containerRef = useRef(null);
    const assistant_id = "asst_lRAD0l8rOXfLbQdUNfHtaEVf";
    const [newMessageToType, setnewMessageToType] = useState();
    let messageList = [];

    useEffect(() => {
        if(Active !== undefined && Active !== null && Active !== "") {
            setMessages([]);
            fetchMessages();
        }
    },[Active])


    const scrolltoBottom = () => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    const handleMessageToThread =( ) => {
        if(UserMessage === ""){
           return;
        }else{

            const newUserMessage = {
                
                id: Date.now(),
                role: "user",
                content: [{ text: { value: UserMessage } }]
            };
            setMessages(prevMessages => [...prevMessages, newUserMessage]);

            setUserMessage("");
            setWaiting(true);
            fetch(`https://api.openai.com/v1/threads/${Active}/messages`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${userData.open_ia_key}`,
                  'Content-Type': 'application/json',
                  'OpenAI-Beta' : 'assistants=v2',
                },
                body: JSON.stringify({
                    "role": "user",
                    "content": `${UserMessage}`
                })
              })
            .then(response => response.json()) 
            .then(data => handleRun())
            .catch(error => console.error('Error:', error));
        }

    }

    const handleRun =( ) => {
        fetch(`https://api.openai.com/v1/threads/${Active}/runs`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${userData.open_ia_key}`,
              'Content-Type': 'application/json',
              'OpenAI-Beta' : 'assistants=v2',
            },
            body: JSON.stringify({
                "assistant_id" : `${assistant_id}`
            })
          })
          .then(response => response.json())
            .then(data => {

                checkRunStatus(data.id)
            })

            .catch(error => console.error('Error:', error));
    }

    const checkRunStatus = (runId) => {

        const interval = setInterval(() => {
            fetch(`https://api.openai.com/v1/threads/${Active}/runs/${runId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userData.open_ia_key}`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta': 'assistants=v2',
                }
            })
                .then(response => response.json())
                .then(data => {
                    if(data.status === undefined) {
                        setnewMessageToType(false);
                        setWaiting(false);
                        clearInterval(interval);
                    }
                    if (data.status === 'completed') {
                        setnewMessageToType(true);
                        clearInterval(interval);
                        setWaiting(false);
                        fetchMessages();
                    } else {

                    }
                })
                .catch(error => {
                    clearInterval(interval);
                    console.error('Error:', error);
                });
        }, 3000);
    }

    const fetchMessages = () => {
        fetch(`https://api.openai.com/v1/threads/${Active}/messages`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userData.open_ia_key}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2',
            }
        })
        .then(response => response.json())
            .then(data => {

                if(data.length !== 0){
                    formatArrayText(data.data.reverse());

                }
            })
            .catch(error => console.error('Error fetching messages:', error));
    }
    const extractLink = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        let link = text.match(urlRegex);
        const textWithoutLink = text.replace(urlRegex, '').trim();
        if(link !== null){
            if(!isImageUrl(link)){
                link = null;
            }
        }
        return {
            textWithoutLink: textWithoutLink,
            link: link ? link[0] : null,
          };
      }

      const isImageUrl = (url) => {
        const cleanUrl = url[0].split('?')[0];
        const clean2 = cleanUrl.split('#')[0]
        return (/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i).test(clean2);
    }

    const formatArrayText = (text) => {
        setMessages([]);
        for (let index = 0; index < text.length; index++) {
            setMessages(prevMessages => [...prevMessages, formatText(text[index])]);

        }
      };

    function formatText(text) {
        let helper = text;
        helper.content[0].text.value = text.content[0].text.value.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') 
        return helper;
    }

    if(true){
        messageList.push(<></>)
        if(messages !== undefined){
            for (let index = 0; index < messages.length; index++) {
                let result = extractLink(messages[index].content[0].text.value);

                if(result.link !== null){
                    console.log(result.link);
                    if(index === messages.length - 1 && newMessageToType) {
                        let helper = result.textWithoutLink;
                        messageList.push(<TypingAni WordToType={{helper}} scroll={scrolltoBottom}></TypingAni>)
                    }else{
                        if(messages[index].role === "assistant"){
                            messageList.push(<Message key={messages[index].id} model={{
                                message: result.textWithoutLink,
                                sender: messages[index].role,
                                direction: "incoming"
                            }}></Message>)
                        }
                    }

                    
                    
                    messageList.push(<img src={result.link} alt="ImgFromAssistant" style={{width: "auto", height: "auto", paddingTop: "15px", paddingBottom: "15px"}}></img>)


                }else{
                    if(index === messages.length - 1 && newMessageToType) {
                        if(messages[index].role === "user"){
                            messageList.push(<Message key={messages[index].id} model={{
                                message: messages[index].content[0].text.value,
                                sender: messages[index].role,
                                direction: "outgoing"
                            }}></Message>)
                        }else{
                            let helper = messages[index].content[0].text.value;
                            messageList.push(<TypingAni WordToType={{helper}} scroll={scrolltoBottom}></TypingAni>)
                        }
                        
                    }else{
                        if(messages[index].role === "user"){
                            messageList.push(<Message key={messages[index].id} model={{
                                message: messages[index].content[0].text.value,
                                sender: messages[index].role,
                                direction: "outgoing"
                            }}></Message>)
                        }
                        if(messages[index].role === "assistant"){
                            messageList.push(<Message key={messages[index].id} model={{
                                message: messages[index].content[0].text.value,
                                sender: messages[index].role,
                                direction: "incoming"
                            }}></Message>)
                        }
                    }
                }

                
            }
        }

    }

    return (
        <div className="ChatboxContainer">
            <h3 style={{height: "10vh", textAlign: "center", width: "100%", paddingTop:"10px", paddingBottom: "10px", backgroundColor: "#FFFFFF", color: "black", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.02)", fontWeight: "bold"}} className="TitleText">{Title}</h3>
            <div style={{  height: "89vh", width: "100%" }}>
            <MainContainer className="overrideStyle">
                <ChatContainer className="overrideStyleChatContainer" >
                <MessageList scrollBehavior={"auto"} className="overrideStyleMessageList" ref={containerRef} style={{paddingLeft: "40px", paddingRight: "40px"}} >
                    <>{messageList}</>
                    {waiting === true ? <TypingIndicator className="typingOverride" content="Kodex está pensando..." /> : <></>}
                </MessageList>
                
                
                <MessageInput  onSend={() => {handleMessageToThread()}}  onChange={e =>  setUserMessage(e)}autoFocus placeholder="Type message here" className="overrideStyleInput" attachButton={false} fancyScroll={false}>
                </MessageInput>

                
                
                </ChatContainer>
            </MainContainer>
            </div>
        </div>
    )
}