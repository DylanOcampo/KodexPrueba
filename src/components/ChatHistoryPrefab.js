import more from "../img/more.svg";
import React, { useState, useEffect, useRef, useContext } from 'react';
import { ElementContextPopUp } from "../context/PopUpContext";
import Dropdown from 'react-bootstrap/Dropdown';
import edit from "../img/editar.png";
import delate from "../img/eliminar.png";
import { ElementContextThread } from "../context/ThreadContext";
export const ChatHistoryPrefab = ({date, name, threadId}) => {

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}>
          {children}
          <img src={more} alt="more"/>
        </a>
      ));
    const { changeValuePopUP } = useContext(ElementContextPopUp);
    const [isClicked, setIsClicked] = useState(false);
    const botonRef = useRef(null);
    const {updateActive, changeValueThread } = useContext(ElementContextThread);
    const handleClickOutside = (event) => {
        if (botonRef.current && !botonRef.current.contains(event.target)) {
          setIsClicked(false);
        }
      };

    const handleClickDelete = () => {
        changeValueThread(threadId);
        changeValuePopUP("eliminate");
    } 

    const handleClickEdit = () => {
        changeValueThread(threadId);
        changeValuePopUP("edit");
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
    
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, []);
    return (
        <div style={{paddingTop: "10px", width: "100%", paddingRight: "5px"}}>
            <div onClick={handleClick} className="ChatHistoryPrefabContainer" style={{position: "relative"}}>
                <div className="rowContainer" style={{justifyContent: "space-between", width: "100%", height:"100%", }}>
                    <div className="ColumnContainer" style={{paddingLeft: "20px", paddingRight: "5px", alignItems: "flex-start", height:"100%", justifyContent:"center"}}>
                        <p className="ChatHistoryTime" style={{paddingBottom: "5px"}}>{name}</p>
                        <p className="ChatHistoryText">{helper}</p>
                    </div>
                    <Dropdown className= "imgClear" style={{
                        paddingRight: "15px",
                        paddingTop: "25px",
                        width: "40px"
                    }}>
                    <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleClickEdit}><img src={edit} style={{color: "black", paddingRight: "20px", width: "40px"}}></img>Editar</Dropdown.Item>
                        <Dropdown.Item onClick={handleClickDelete} style={{color: "red"}}><img src={delate} style={{color: "black", paddingRight: "20px", width: "40px"}}></img>Eliminar</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}