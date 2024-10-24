import { ChatHistoryPrefab } from "./ChatHistoryPrefab"
import { ChatHistoryPlaceholder } from "./ChatHistoryPlaceHolder"
import logout from "../img/salir.png";
import account from "../img/account.svg";
import sidebar from "../img/sidebar.svg";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef, useContext} from "react";
import{ CreateChat} from "./CreateChat";
import Dropdown from 'react-bootstrap/Dropdown';
import { AuthContext } from "../pages/AuthContext";

import { ElementContextPopUp } from "../context/PopUpContext";
export const Sidebar = () => {
  const {value} = useContext(ElementContextPopUp);
  const [prevData, setData] = useState("");
  const [offset, setOffset] = useState(0);
  const [flag, setFlag] = useState(true);
  const limit = 10;
  const [newData, setNewData] = useState("");

  const handleDataForScroll = () => {
    let helper = "";
    if(newData !== null && newData !== undefined && newData !== ""){
      helper = prevData;
      //helper.thread_bundles = [];
      helper.thread_bundles  = [...prevData.thread_bundles, ...newData.thread_bundles];
      helper.next = newData.next;
      setData(helper);
      setNewData("");
      setFlag(true);
    }
  }

  const handleScroll = (e) => {
    let tolerance = 1;
    const bottom = e.target.scrollHeight - e.target.scrollTop - tolerance <= e.target.clientHeight;
    
    if (bottom && flag) {
      if(prevData.next != null && prevData.next !== ""){
        setFlag(false);
        console.log("next")
        handleNextThread();
      }
      
    }
  }
  const gotToNewPage= async ()=>{
    const response = fetch("http://165.22.178.7/api/v1/logout",{
      method: "POST",
      headers: {
          'Authorization': `Bearer ${userData.access_token}`,
      },
    })
      .then(navigate("/"))
      .catch(error => console.error('Error:', error))
  }
  const handlethreadsUserByUser= async () => {
    fetch(`http://165.22.178.7/api/v1/threads/${limit}/${offset}`,{
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.access_token}`
      },
    })
    .then(response => {
      if (!response.ok) {
      throw new Error(`Error del servidor`);
    }
    return response.json();
    })
    .then(data => {
        setData(data);
    })
    .then()
    .catch(error => console.error('Error:', error));
  }
    const handleNextThread = async () => {
      fetch(`http://165.22.178.7/api${prevData.next}`,{
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.access_token}`
        },
      })
      .then(response => {
        if (!response.ok) {
        throw new Error(`Error del servidor`);
      }
      return response.json();
      })
      .then(data => {
        setNewData(data);
          
      })
      .catch(error => console.error('Error:', error));
    }
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}>
          {children}
          <img src={account} alt="sidebar" style={{width: "40px"}}></img>
        </a>
      ));
    const[isOpen, setIsOpen] = useState(true)
    const[isDisplay, setIsDisplay] = useState(false)
    const botonRef = useRef(null);
    const navigate = useNavigate()
    const { userData } = useContext(AuthContext);
    const toggleDropdown = () => {
        setIsDisplay(!isDisplay);
    };
    const handleLogout = () => {
        navigate("/");
    }
    const handleClickOutside = (event) => {
        if (botonRef.current && !botonRef.current.contains(event.target)) {
          setIsDisplay(false);
        }
      };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, []);

      useEffect(() => {
        if(value === ""){
          handlethreadsUserByUser();
        }
      }, [value])

      

      useEffect(() => {
        if(newData !== ""){
            handleDataForScroll();
        }
      },[newData])


      let element;
      if(prevData !== undefined && prevData !== null && prevData !== ""){
        element = (prevData.thread_bundles.map(item => (
          <ChatHistoryPrefab date={item.updated_at} name={item.title} threadId={item.thread_id} internalId={item.id}></ChatHistoryPrefab>)))
      }else{
        element = (<><ChatHistoryPlaceholder></ChatHistoryPlaceholder> <ChatHistoryPlaceholder></ChatHistoryPlaceholder> <ChatHistoryPlaceholder></ChatHistoryPlaceholder></>)
      }

    return (
        <div key={prevData}>
        {isOpen ?
            <div className="ColumnContainer" style={{justifyContent: "flex-start", height: "100vh"}}>
                <div className="rowContainer" style={{ width: "100%", paddingTop: "10px", paddingRight: "15px", alignItems: "center", justifyContent: "space-around"}}>
                    <Dropdown className= "imgClear">
                    <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => gotToNewPage()}><img src={logout} alt="close" style={{color: "black", paddingRight: "20px", width: "35px", paddingBottom: "2.2%"}}></img>Cerrar sesión</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                    <h2 className="TitleText" style={{ textAlign: "center", fontSize: "22px", paddingTop: "2.2%"}}>{userData.user.name}</h2>
                    <img src= {sidebar} alt="sidebar" style={{width: "30px"}}  onClick={()=> setIsOpen(!isOpen)}></img>
                </div>
                <div className="sidebarContainer" onScroll={handleScroll}>
                  <>{element}</>
                </div>
                <CreateChat></CreateChat>
            </div>

         : <div className="sidebarClosed">

            <div className="rowContainer" style={{ paddingTop: "30px"}}>

             <img src= {sidebar} alt="sidebar"style={{ width: "30px"}} onClick={()=> setIsOpen(!isOpen)}></img>
            </div>

         </div>
        }
        </div>
    )
}