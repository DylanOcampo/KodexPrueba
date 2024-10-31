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
                    <button className= "imgClear" onClick={handleClick} style={{alignItems: "center"}}> <h4 className="CreateNewChatText">CREAR NUEVO CHAT</h4> <img src={add} style={{paddingLeft: "10px"}}></img></button>
        </div>
    )
}