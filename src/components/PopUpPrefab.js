import { ElementContextPopUp } from "../context/PopUpContext";
import React, { useContext } from "react";
import { ElementContextThread } from "../context/ThreadContext";

import { useRef } from "react";
import { AuthContext } from "../pages/AuthContext";

export const PopUpPrefab = ({identifier}) => {

  const today = new Date();
  const month = today.getMonth()+1;
  const year = today.getFullYear();
  const date = today.getDate();
  const currentDate = date + "/" + month + "/" + year;

  const inputEdit = useRef("");
  const inputNew = useRef("");
  const { changeValuePopUP } = useContext(ElementContextPopUp);
  const { changeActive, value } = useContext(ElementContextThread);
  const { userData } = useContext(AuthContext);
  const handleCancelButton = () => {
    changeValuePopUP("");
  };
  console.log(identifier);

  const handleEditThread =( ) => {

      fetch('http://165.22.178.7/back/api/v1/threads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.access_token}`
        },
        body: JSON.stringify({
          'thread_id': value,
          'title': inputEdit.current.value,
          'last_message': currentDate,
        })
      })

        .catch(error => console.error('Error:', error));
      changeValuePopUP("");

}
  const  handleNewThread = async () =>{
    fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userData.open_ia_key}`,  
        'Content-Type': 'application/json',
        'OpenAI-Beta' : 'assistants=v2'    
      },
      body: JSON.stringify({

      })
    })
    .then(response => response.json())
      .then(data => {
        console.log( data);
        changeActive(data.id, inputNew.current.value, inputNew.current.value, userData.access_token)
        return data.id;
      })
      .catch(error => console.error('Error:', error));
  }

  const handleEliminateThread =( ) => {
    fetch(`https://api.openai.com/v1/threads/${value}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userData.open_ia_key}`,  
        'Content-Type': 'application/json',
        'OpenAI-Beta' : 'assistants=v2'    
      },
      body: JSON.stringify({
        
      })
    })
      .then(response => response.json())
      .then(data => console.log(data))

      .catch(error => console.error('Error:', error));

    console.log(value);
    fetch('http://165.22.178.7/back/api/v1/threads', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.access_token}`
      },
      body: JSON.stringify({
        'thread_id': value
      })
    })
      .catch(error => console.error('Error:', error));
    changeValuePopUP("");

  }

  if(identifier === "new") {
    return (
      <div className="popUpContainer">
          <div className="popUpMessage">
          <h3 style={{ paddingTop: "3%", paddingBottom: "1%", fontWeight: "bold", fontSize: "1.5vw"}}>Ingrese título de la conversación</h3>


          <div style={{paddingTop: "0px", paddingBottom: "3%", width: "100%", display: "flex", justifyContent: "center"}}><input
            ref={inputNew}
            type="text"
            name="text"
            className="input"
          /></div>
          
          <div className="rowContainer" style={{width: "100%" , height: "100%", justifyContent: "space-evenly"}}>
          <button
            className="styleCancelButtonPopUpDesktop"
            onClick={() => {
              handleCancelButton();
            }}
          >
            <h3 style={{ color: "white" , fontSize: "1.2vw"}}>Cancelar</h3>
          </button>
          <button
            className="styleButtonPopUpDesktop"
            onClick={() => {
              handleNewThread();
            }}
          >
            <h3 style={{ color: "white", fontSize: "1.2vw" }}>Aceptar</h3>
          </button>
          </div>
        </div>
      </div>
    );
  }

  if(identifier === "eliminate") {
    return (
      <div className="popUpContainer">
          <div className="popUpMessage">
          <h3 style={{ paddingTop: "5%", paddingBottom: "5%", textAlign: "center", fontSize: "1.5vw"}}>¿Está seguro que desea eliminar la conversación? </h3>

          
          <div className="rowContainer" style={{width: "100%" , height: "100%", justifyContent: "space-evenly"}}>
          <button
            className="styleButtonPopUpDesktop"
            onClick={() => {
              handleCancelButton();
            }}
          >
            <h3 style={{ color: "white", fontSize: "1.2vw"}}>Cancelar</h3>
          </button>
          <button
            className="styleCancelButtonPopUpDesktop"
            onClick={() => {
              handleEliminateThread();
            }}
          >
            <h3 style={{ color: "white", fontSize: "1.2vw" }}>Eliminar</h3>
          </button>
          </div>
        </div>
      </div>
    );
  }

  if(identifier=== "edit"){
    return (
      <div className="popUpContainer">
          <div className="popUpMessage">
          <h3 style={{ paddingTop: "4%", paddingBottom: "1%", fontSize: "1.5vw"}}>Ingrese nuevo título de la conversación</h3>

          <div style={{paddingTop: "0px", paddingBottom: "2%", width: "100%", display: "flex", justifyContent: "center"}}><input
            ref={inputEdit}
            type="text"
            name="text"
            className="input"
          /></div>
          
          <div className="rowContainer" style={{width: "100%" , height: "100%", justifyContent: "space-evenly"}}>
          <button
            className="styleCancelButtonPopUpDesktop"
            onClick={() => {
              handleCancelButton();
            }}
          >
            <h3 style={{ color: "white", fontSize: "1.2vw" }}>Cancelar</h3>
          </button>
          <button
            className="styleButtonPopUpDesktop"
            onClick={() => {
              handleEditThread();
            }}
          >
            <h3 style={{ color: "white", fontSize: "1.2vw" }}>Aceptar</h3>
          </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <></>
  )
};
