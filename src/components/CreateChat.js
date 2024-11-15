import { ElementContextPopUp } from "../context/PopUpContext";
import React, { useContext } from "react";
import add from "../img/editSquare.svg"
export const CreateChat = () => {

    const { changeValuePopUP } = useContext(ElementContextPopUp);
    const handleClick =( ) => {
        changeValuePopUP("new");
    }

    return (
        <div className="createChatContainer" >
                    <button className= "imgClear" onClick={handleClick} style={{alignItems: "center", backgroundColor: "rgba(210, 255, 4, 1)", borderRadius: "50px", width: "82%", height: "45%", justifyContent: "center"}}> <h4 className="ChatHistoryTime" style={{color: "black", lineHeight: "1"}}>Crear nuevo chat</h4> <img src={add} style={{paddingLeft: "10px", color: "black"}}></img></button>
        </div>
    )
}