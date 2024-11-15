import React, { useState, useEffect, useContext  } from 'react';
import { Message, } from "@chatscope/chat-ui-kit-react";

import { ElementContextAni } from '../context/AniContext';


export const TypingAni = ({WordToType, scroll}) => {
    
    const [value, setValue] = useState("");
    const [count, setCount] = useState(0);
    const str = WordToType.helper;
    const {valueAni, changeValueAni} = useContext(ElementContextAni);
    useEffect(() => {
        if(!valueAni){
            changeValueAni(true);
        }
        if(str === value){
            changeValueAni(false);
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
        }, 5)
    })

    return (
        <Message key={"0101010"} model={{
                            message: value,
                            sender: "assistant",
                            direction: "incoming"
                        }}></Message>

    )
}