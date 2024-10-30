import more from "../img/more.svg";
import React, { useState, useEffect, useContext } from 'react';
import { ElementContextPopUp } from "../context/PopUpContext";
import edit from "../img/editar.png";
import delate from "../img/eliminar.png";
import { ElementContextThread } from "../context/ThreadContext";
export const ChatHistoryPrefab = ({date, name, threadId}) => {

    const { changeValuePopUP } = useContext(ElementContextPopUp);
    const [isClicked, setIsClicked] = useState(false);

    const {updateActive, changeValueThread, changeTitle } = useContext(ElementContextThread);

    const handleClickDelete = () => {
        changeValueThread(threadId);
        changeValuePopUP("eliminate");
        setIsClicked(false);
    } 

    const handleClickEdit = () => {
        changeValueThread(threadId);
        changeTitle(name);
        changeValuePopUP("edit");
        setIsClicked(false);
    } 

    function useOutsideAlerter(ref) {
        useEffect(() => {
          /**
           * Alert if clicked on outside of element
           */
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
              alert("You clicked outside of me!");
            }
          }
          // Bind the event listener
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
      }

    let helper 
    if(date !== undefined && date !== null && date !== ""){
        helper = date.split("T")[0];
    }else{
        helper = "";
    }

    const handleClick = () => {
        updateActive(threadId, name);
    };

    const handleClickMiniMenu  = () => {
        if(isClicked){
            
            setIsClicked(false);
        }else{
            setIsClicked(true);
        }
        console.log(isClicked);
    }
    
    return (
        <div style={{paddingTop: "10px", width: "100%", paddingRight: "5px"}}>
            <div onClick={handleClick} className="ChatHistoryPrefabContainer" style={{position: "relative"}}>
                <div className="rowContainer" style={{justifyContent: "space-between", width: "100%", height:"100%", alignItems: "center"}}>
                    <div className="ColumnContainer" style={{paddingLeft: "20px", paddingRight: "5px", alignItems: "flex-start", height:"100%", justifyContent:"center"}}>
                        <p className="ChatHistoryTime" style={{paddingBottom: "5px"}}>{name}</p>
                        <p className="ChatHistoryText">{helper}</p>
                    </div>
                    <div style={{paddingRight: "10px"}}>
                        <button className="imgClear" onClick={handleClickMiniMenu}><img src={more}></img></button>
                        {!isClicked ? <></> : 
                        <div className="sideBarMiniMenu">
                            <div className="rowContainer" style={{justifyContent: "flex-start", paddingLeft: "10px"}}>
                                <button className="sidebarMiniMenuButton" onClick={handleClickEdit}><img src={edit} style={{width: "25px"}} alt="edit"></img> <p style={{paddingTop: "10px", fontSize: "1.2vw", paddingLeft: "10px"}}>Editar</p></button>
                            </div>
                            <div className="rowContainer" style={{paddingLeft: "10px"}}>
                                <button className="sidebarMiniMenuButton" onClick={handleClickDelete}><img src={delate} style={{width: "25px"}} alt="delete"></img> <p style={{paddingTop: "10px", fontSize: "1.2vw", paddingLeft: "10px"}}>Eliminar</p></button>
                            </div>

                        </div>} 
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    )
}