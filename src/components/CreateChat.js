import { ElementContextPopUp } from "../context/PopUpContext";
import React, { useContext } from "react";
import add from "../img/editSquare.svg"
export const CreateChat = () => {

    const { changeValuePopUP } = useContext(ElementContextPopUp);
    const handleClick =( ) => {
        changeValuePopUP("new");
    }

    return (
        <div className="rowContainer" style={{justifyContent: "space-evenly", width: "100%", height: "12%", alignItems: "center" }}>
                    <button className= "imgClear" onClick={handleClick} style={{alignItems: "center"}}> <h4 className="CreateNewChatText">CREAR NUEVO CHAT</h4> <img src={add} style={{paddingLeft: "10px"}}></img></button>
        </div>
    )
}