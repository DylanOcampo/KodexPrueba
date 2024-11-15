import more from "../img/more.svg";
import React, { useState, useEffect, useContext, useRef } from 'react';
import { ElementContextPopUp } from "../context/PopUpContext";
import edit from "../img/editar.png";
import delate from "../img/eliminar.png";
import { ElementContextThread } from "../context/ThreadContext";
import {FloatingOverlay} from '@floating-ui/react';
import { ElementContextSidebar } from "../context/SidebarContext";
import { ElementContextAni } from '../context/AniContext';
export const ChatHistoryPrefab = ({date, name, threadId}) => {
    const componentRef = useRef(null);
    const { changeValuePopUP } = useContext(ElementContextPopUp);
    const { scrollPos } = useContext(ElementContextSidebar);
    const [isClicked, setIsClicked] = useState(false);
    const {updateActive, changeValueThread, changeTitlePopUp } = useContext(ElementContextThread);
    const [ignoreNextClick, setIgnoreNextClick] = useState(false);
    const [position, setPosition] = useState();
    const {changeAniStop, AniStop} = useContext(ElementContextAni);
    const updatePosition = () => {
        if (componentRef.current) {
          const rect = componentRef.current.getBoundingClientRect();
          setPosition(
            rect.y
          );
        }
      };
    
    const handleClickDelete = () => {
        changeValueThread(threadId);
        changeValuePopUP("eliminate");
        setIsClicked(false);
    } 

    const handleClickEdit = () => {
        changeValueThread(threadId);
        changeTitlePopUp(name);
        changeValuePopUP("edit");
        setIsClicked(false);
    } 

    useEffect(() => {
        updatePosition(); // Llamada inicial para obtener la posición cuando el componente se monta
    
        // Agrega un listener para actualizar la posición al redimensionar la ventana o hacer scroll
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);
    
        return () => {
          window.removeEventListener('resize', updatePosition);
          window.removeEventListener('scroll', updatePosition);
        };
      }, []);

    function useOutsideAlerter(ref, setIsClicked, setIgnoreNextClick) {
        useEffect(() => {
          /**
           * Alert if clicked on outside of element
           */
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                    setIsClicked(false);
                    setIgnoreNextClick(true);
                    setTimeout(() => setIgnoreNextClick(false), 120);
            }
          }
          // Bind the event listener
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref, setIsClicked, setIgnoreNextClick]);
      }

    let helper
    if(date !== undefined && date !== null && date !== ""){
        helper = date.split("T")[0];
    }else{
        helper = "";
    }
    let MiniMenu;

    if(window.innerHeight/2 > position- scrollPos){
        MiniMenu = (<FloatingOverlay style={{position: "static"}}>
            <div className="sideBarMiniMenu" >
                <div className="rowContainer" style={{justifyContent: "center"}}>
                    <button className="sidebarMiniMenuButton" style={{borderRadius: "10px"}}onClick={handleClickEdit}><img src={edit} style={{width: "25px", paddingLeft: "5px"}} alt="edit"></img> <p className="MiniMenuText">Editar</p></button>
                </div>
                <div className="rowContainer" style={{justifyContent: "center"}}>
                    <button className="sidebarMiniMenuButton" style={{borderRadius: "10px"}} onClick={handleClickDelete}><img src={delate} style={{width: "25px", paddingLeft: "5px"}} alt="delete"></img> <p className="MiniMenuText">Eliminar</p></button>
                </div>

            </div> 
            </FloatingOverlay>)
    }else{
        MiniMenu = (<FloatingOverlay style={{position: "static"}}>
            <div className="sideBarMiniMenuTop" >
                <div className="rowContainer" style={{justifyContent: "center"}}>
                    <button className="sidebarMiniMenuButton" style={{borderRadius: "10px"}} onClick={handleClickEdit}><img src={edit} style={{width: "25px", paddingLeft: "5px"}} alt="edit"></img> <p className="MiniMenuText">Editar</p></button>
                </div>
                <div className="rowContainer" style={{justifyContent: "center"}}>
                    <button className="sidebarMiniMenuButton" style={{borderRadius: "10px"}} onClick={handleClickDelete}><img src={delate} style={{width: "25px", paddingLeft: "5px"}} alt="delete"></img> <p className="MiniMenuText">Eliminar</p></button>
                </div>

            </div> 
            </FloatingOverlay>)
    }

    const handleClick = (e) => {
        
        if(e.target.className === "" || e.target.className === "sidebarMiniMenuButton"  || e.target.className === "MiniMenuText"){
            return;
        }
        if(!AniStop){
            changeAniStop(true);
        }
        
        updateActive(threadId, name);
    };

    const handleClickMiniMenu  = () => {
        if (ignoreNextClick) {
            return;
        }
        setIsClicked(!isClicked);
        /*if(isClicked){
            setIsClicked(false);
            console.log("1");
        }else{
                setIsClicked(true);
                console.log("2");
        }*/
 
    }
    const sidebarRef = useRef(null);
    useOutsideAlerter(sidebarRef, setIsClicked, setIgnoreNextClick);
    return (
        <div  ref= {componentRef} style={{paddingTop: "10px", width: "100%", paddingRight: "5px", paddingBottom: "10px"}}>
            <div onClick={handleClick} className="ChatHistoryPrefabContainer" style={{position: "relative"}}>
                <div className="rowContainer" style={{justifyContent: "space-between", width: "100%", height:"100%", alignItems: "center"}}>
                    <div className="ColumnContainer" style={{paddingLeft: "20px", paddingRight: "5px", alignItems: "flex-start", height:"100%", justifyContent:"center"}}>
                        <p className="ChatHistoryTime" style={{paddingBottom: "5px"}}>{name.length > 16 ? `${name.substring(0, 20)}...` : name}</p>
                        <p className="ChatHistoryText">{helper}</p>
                    </div>
                    <div style={{paddingRight: "10px"}}>
                        <button className="imgClear" onClick={handleClickMiniMenu}><img src={more}></img></button>
                        {isClicked &&
                        <div ref={sidebarRef}>{MiniMenu} </div>
                        }
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    );
}