import React, { useState, useEffect } from 'react';
import { Message, } from "@chatscope/chat-ui-kit-react";



export const TypingAni = ({WordToType, scroll}) => {
    const [value, setValue] = useState("");
    const [count, setCount] = useState(0);
    
    const str = WordToType.helper;

    useEffect(() => { 
        if(str === value){
            return;
        }
        const timeout = setTimeout(() => {
            setCount(count+1);
            if(str !== value) {
                for (let index = 0; index < count; index++) {
                    setValue(value + str[index])
                    if(scroll !== undefined){
                        scroll();
                    }
                }
            }
        }, 20)
        
    })

    return (

        <Message key={"0101010"} model={{
                            message: value,
                            sender: "assistant",
                            direction: "incoming"
                        }}></Message>

    )
}