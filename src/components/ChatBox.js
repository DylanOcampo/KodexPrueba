import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, InputToolbox, SendButton } from "@chatscope/chat-ui-kit-react";
import { ElementContextThread } from "../context/ThreadContext";
import React, { useState, useEffect, useContext, useRef } from 'react';
import { TypingAni } from "./TypingAni";
import { AuthContext } from "../pages/AuthContext";
import { ElementContextSidebar } from "../context/SidebarContext";
import { ElementContextAni } from '../context/AniContext';
import logo from "../img/kodexLogo.png";

export const ChatBox = () => {
    const { Active, Title } = useContext(ElementContextThread);
    const { userData, setUserData } = useContext(AuthContext);
    const { valueSB } = useContext(ElementContextSidebar);
    const [UserMessage, setUserMessage] = useState("");
    const [waiting, setWaiting] = useState(false);
    const [messages, setMessages] = useState([]);
    const containerRef = useRef(null);
    const assistant_id = "asst_zrSOh8NUnr9XkoSAcZOkFP8d";
    const [newMessageToType, setnewMessageToType] = useState();
    const [fileIds, setFileIds] = useState({});
    const [filePopup, setFilePopup] = useState({ visible: false, filename: '', x: 0, y: 0 });
    let messageList = [];
    const [fontSize, setFontSize] = useState(20);
    const {valueAni, changeAniStop, AniStop} = useContext(ElementContextAni);
    const titleRef = useRef(null);
    const [isNewChat, setIsNewChat] = useState(true);
    const [greetingShown, setGreetingShown] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [ereasedThread, setEreasedThread] = useState(false);
    useEffect(() => {
        
        if(Active !== undefined && Active !== null && Active !== "") {
            setMessages([]);
            fetchMessages();
            setEreasedThread(false);
        }else{
            setMessages([]);
            setEreasedThread(true);
        }
    },[Active])

    useEffect(() => {
        if (messages.length === 0 && !loadingMessages && !ereasedThread) {
          changeAniStop(false);
          setLoadingMessages(false);
          setIsNewChat(true);
          setGreetingShown(false);
        } else {
          setIsNewChat(false);
        }
      }, [messages, loadingMessages]);

    const scrolltoBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollToBottom();
        }
    };

    const handleStop = () => {
        if(!AniStop){
            changeAniStop(true);
        }
    };

    const handleMessageToThread = async() => {
        await changeAniStop(false);
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
            scrolltoBottom();
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
                "assistant_id" : `${assistant_id}`,
                "model" : "gpt-4o-mini",
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
        setLoadingMessages(true);
        fetch(`https://api.openai.com/v1/threads/${Active}/messages?limit=100`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userData.open_ia_key}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2',
            }
        })
        .then(response => response.json())
            .then(data => {
                console.log(data);
                if(data.length !== 0){
                    formatArrayText(data.data.reverse());
                }
                setLoadingMessages(false);
            })
            .catch(error => console.error('Error fetching messages:', error));
    }
    const fetchfiles = async (filesid) => {
        try {
            const response = await fetch(`https://api.openai.com/v1/files/${filesid}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userData.open_ia_key}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            return data.filename;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    };
    const extractLinkAndBracketContent = (text) => {
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

    const handleFileHover = async (fileId, x, y) => {
        const filename = await fetchfiles(fileId);
        if (filename) {
            setFilePopup({ visible: true, filename, x, y });
        }
    };

    function formatText(text) {
        let helper = text;
        formatSource(text);
        helper.content[0].text.value = text.content[0].text.value.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        helper.content[0].text.value = text.content[0].text.value.replace(
            /### (.*)/g,
            '<span style="font-weight:bold; font-size:1.2em;">$1</span>'
        );
        helper.content[0].text.value = text.content[0].text.value.replace(/- /g, '• ');
        helper.content[0].text.value = helper.content[0].text.value.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank" style="color: blue; text-decoration: underline;">$1</a>');
        helper.content[0].text.value = text.content[0].text.value.replace(/【/g, ' [')
        .replace(/】/g, ']')
        .replace(/\[(\d+):(\d+)†[^\]]*\]/g, (match, p1, p2) => {
             const fileId = text.content[0].text.annotations[0].file_citation.file_id;
                setFileIds(prevIds => ({ ...prevIds, [`${p1}:${p2}`]: fileId }));

                return `<span class="hoverable-ref" style="cursor: pointer;" data-file-id="${fileId}">[${p1}:${p2}]</span>`;
        });
        return helper;
    }
    const hideFilePopup = () => {
        setFilePopup({ ...filePopup, visible: false });
    };
    let scrollTimeoutId;
    let timeoutId;
    useEffect(() => {
        const handleMouseOver = (event) => {
            if (event.target.classList.contains("hoverable-ref")) {
                const fileId = event.target.getAttribute("data-file-id");
                const { clientX: x, clientY: y } = event;
                handleFileHover(fileId, x, y);
            }
        };
        
        const handleMouseOut = (event) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (event.target.classList.contains("hoverable-ref")) {
                    hideFilePopup();
                }else{
                    hideFilePopup();
                }
            }, 50);
        };
        
        
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);
        return () => {
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
        };
    }, []);
    const handleScroll = () => {
            
        clearTimeout(scrollTimeoutId);
        scrollTimeoutId = setTimeout(() => {
            hideFilePopup();
        }, 50);
    };
    useEffect(() => {
        window.addEventListener("wheel", handleScroll);
        return () => {
            window.removeEventListener("wheel", handleScroll);
            clearTimeout(scrollTimeoutId);
        };
    }, []);
    const [greetingMessage] = useState({
        id: Date.now(),
        role: "assistant",
        content: [{ text: { value: "¡Hola soy kodex! Estoy aquí para ayudarte ¿Dime qué necesitas hoy?" } }]
    });

  useEffect(() => {
    if (!loadingMessages && isNewChat && !greetingShown) {
      setMessages(prevMessages => [
        { ...greetingMessage, id: Date.now() },
        ...prevMessages
      ]);
      
      setGreetingShown(true);
      setIsNewChat(false);
    }
  }, [isNewChat, greetingShown, loadingMessages]);

    const formatArrayText = (text) => {
       // setMessages([]);
       if (text.length > 0) {
        setMessages([]);
        setMessages(prevMessages => {
            const hasGreetingMessage = prevMessages.some(msg => msg.id === 'greeting');
            const newMessages = hasGreetingMessage ? [...prevMessages] : [
                { ...greetingMessage, id: 'greeting' },
                ...prevMessages,
            ];

            text.forEach(t => newMessages.push(formatText(t)));
            return newMessages;
        });
    } else {
        return;
    }
    };

    function formatSource(text){
        let helper = text;
        if(helper.content[0].text.annotations.length > 0){
            const annotation = helper.content[0].text.annotations[0];
        if (annotation.file_citation && annotation.file_citation.file_id) {
            setFileIds(prev => ({
                ...prev,
                [`${helper.id}`]: annotation.file_citation.file_id
            }));
        }
        }
    }
    useEffect(() => {
        const adjustFontSize = () => {
            const containerWidth = titleRef.current ? titleRef.current.offsetWidth : 0;
          let newFontSize = 30;
          const minFontSize = 10;
          const maxFontSize = 30;
          if (containerWidth < 300) {
            newFontSize = 18;
          } else if (containerWidth < 500) {
            newFontSize = 20;
          } else if (containerWidth < 800) {
            newFontSize = 25;
          } else {
            newFontSize = 30;
          }
          const adjustFontSizeToFit = () => {
            if (titleRef.current) {
              const titleElement = titleRef.current;
              let titleHeight = titleElement.scrollHeight;
              let containerHeight = titleElement.clientHeight;
              let currentFontSize = parseInt(window.getComputedStyle(titleElement).fontSize, 10);
              while (titleHeight > containerHeight && newFontSize > minFontSize) {
                newFontSize -= 1;
                titleElement.style.fontSize = `${newFontSize}px`;
                titleHeight = titleElement.scrollHeight;
              }
              while (titleElement.scrollHeight <= containerHeight && currentFontSize < maxFontSize && titleElement.scrollWidth <= containerWidth) {
                currentFontSize += 1;
                titleElement.style.fontSize = `${currentFontSize}px`;
                if (titleElement.scrollHeight > containerHeight || titleElement.scrollWidth > containerWidth) {
                    currentFontSize -= 1; 
                    titleElement.style.fontSize = `${currentFontSize}px`;
                    break;
                }
            }
            }
          };
    
          adjustFontSizeToFit();
          setFontSize(newFontSize);
    };
    
    const resizeObserver = new ResizeObserver(adjustFontSize);
    if (titleRef.current) {
        resizeObserver.observe(titleRef.current);
    }
    return () => {
        resizeObserver.disconnect();
      };
    }, []);
    let isDisabled
    if(Active !== undefined && Active !== null && Active !== ""){
        isDisabled = false;
    }else{
        isDisabled = true;
    }


    if(true){
        messageList.push(<></>)
        if(messages !== undefined){
            for (let index = 0; index < messages.length; index++) {
                if (!loadingMessages && isNewChat && !greetingShown && !ereasedThread) {
                    let helper = greetingMessage.content[0].text.value;
                    if (messages.length === 0 && !loadingMessages && !greetingShown && !ereasedThread) {
                        messageList.push(<TypingAni WordToType={{helper}} ></TypingAni>)
                    }
                }
                let result = extractLinkAndBracketContent(messages[index].content[0].text.value);
                if(result.link !== null){
                    console.log(result.link);
                    if(index === messages.length - 1 && newMessageToType) {
                        let helper = result.textWithoutLink;
                        if(!AniStop){
                            messageList.push(<Message key={messages[index].id} model={{
                                message: result.textWithoutLink,
                                sender: messages[index].role,
                                direction: "incoming"
                            }}></Message>)

                        }else{
                            messageList.push(<TypingAni WordToType={{helper}} ></TypingAni>)
                        }
                        
                    }else{
                        if(messages[index].role === "assistant"){
                            messageList.push(<Message key={messages[index].id} model={{
                                message: result.textWithoutLink,
                                sender: messages[index].role,
                                direction: "incoming"
                            }}></Message>)
                        }
                    }


                    messageList.push(<img src={result.link} alt="ImgFromAssistant" style={{ paddingTop: "15px", paddingBottom: "15px", maxWidth: "50vw", maxHeight: "50vh"}}></img>)


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
                            if(!AniStop){
                                messageList.push(<TypingAni WordToType={{helper}} ></TypingAni>)
                                
                            }else{
                                messageList.push(<Message key={messages[index].id} model={{
                                    message: messages[index].content[0].text.value,
                                    sender: messages[index].role,
                                    direction: "incoming"
                                }}></Message>)
                            }
                            
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

    let classHelper
    if(!valueSB){
        classHelper = "ChatboxContainerClose";
    }else{
        classHelper = "ChatboxContainer";
        
    }

    let CanSeeWelcomeText = false;
    if(Active === undefined || Active === null || Active === ""){
        CanSeeWelcomeText = true;
    }


    return (
        <div className= {classHelper}>
            <h3 ref={titleRef} style={{ height: "10vh", textAlign: "center", width: "70%", paddingTop:"10px", paddingBottom: "10px", backgroundColor: "#FFFFFF", color: "black", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.02)", fontWeight: "bold"}} className="TitleText">
                {Title}
                <img src={logo} style={{height: "2vw", position: "absolute", top: "3.5%", right: "2.5%"}} ></img>
            </h3>
            <div style={{  height: "89vh", width: "100%" }}>
            <MainContainer className="overrideStyle">
                <ChatContainer className="overrideStyleChatContainer" >
                <MessageList scrollBehavior={"auto"} className="overrideStyleMessageList" ref={containerRef} style={{paddingLeft: "40px", paddingRight: "40px", height: "89vh", overflowY: "auto"}} >
                    <>{messageList}</>
                    {waiting === true ? <TypingIndicator className="typingOverride" content="Kodex está pensando..." /> : <></>}
                </MessageList>
                <MessageInput value={UserMessage} disabled={isDisabled} onSend={() => {handleMessageToThread()}} onChange={e =>  setUserMessage(e)}autoFocus placeholder="Pregunta a Kodex AI" className="overrideStyleInput" attachButton={false} fancyScroll={false} onPaste={(evt) =>{
                    evt.preventDefault();
                    let pastedText = evt.clipboardData.getData("Text");

                    const formattedTextContainer = document.createElement("div");
                    formattedTextContainer.textContent = pastedText;
                    formattedTextContainer.style.backgroundColor = "transparent";
                    formattedTextContainer.style.color = "black";

                    let formattedText = formattedTextContainer.textContent;
                    setUserMessage(prevMessage => prevMessage + formattedText);
                }
                }>
                </MessageInput>
                </ChatContainer>
                <div style={{paddingTop: "10px", position: "absolute", bottom: "0px", width: "100%", zIndex: "100000", fontSize: "12PX", textAlign: "center"}} className="disclaimer">Kodex AI puede cometer errores. Verifica la información importante.</div>
            </MainContainer>
            {filePopup.visible && !valueAni ? (
                <div
                    style={{
                        position: "absolute",
                        top: filePopup.y - 50,
                        left: filePopup.x,
                        transform: "translateX(-50%)",
                        backgroundColor: "white",
                        color: "black",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        pointerEvents: "none",
                        zIndex: 1000,
                    }}
                >
                    {filePopup.filename}
                </div>
            ) : <></>}
            <button
                onClick={scrolltoBottom}
                className="onTopButtons"
                style={{
                    right: "60px",
                }}
            >
                <p style={{color: "rgba(88,88,150,255)"}}>↓</p>
            </button>
            <button
                onClick={handleStop}
                className="onTopButtons"
                style={{
                    right: "115px",
                }}
            >
                <p style={{color: "rgba(131,131,183,255)"}}>■</p>
            </button>
            {CanSeeWelcomeText && <div className="WelcomeTextContainer">
                <p className="WelcomeText"> Bienvenido a Kodex by Bigfoot. Por favor crea un nuevo chat o dale click a un chat en el menú lateral </p>
            </div> }
            

            </div>
            
        </div>
        
    )
}
