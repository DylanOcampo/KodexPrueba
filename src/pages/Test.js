import { TypingAni } from "../components/TypingAni"

import { ElementContextPopUp } from "../context/PopUpContext";

import { ElementContextThread } from "../context/ThreadContext";
import { ElementContextAccess } from "../context/AccessContext";

import React, { useContext, useEffect } from "react";

export const Test = () => {

    const { changeValuePopUP } = useContext(ElementContextPopUp);
    const { changeActive, Active, value } = useContext(ElementContextThread);
    const { valueToken, valueApiKey } = useContext(ElementContextAccess);

    useEffect(() => {
        fetch('http://165.22.178.7/api/v1/threads', {
            method: 'POST',
            headers: {
              'access_token': "72|16bmJWvHQyCoCWQnD54uANi9OJMJ1B7smXm04kqb7f682b64",  
            },
            body: JSON.stringify({
              'thread_id': "Active",
              'title': "inputNew.current.value",
              'last_message': "currentDate",
            })
          })
            .then(response => response.json())
    
            .catch(error => console.error('Error:', error));

    },[])

    return (
        <></>
    )
}