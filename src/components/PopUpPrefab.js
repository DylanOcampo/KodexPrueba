import { ElementContextPopUp } from "../context/PopUpContext";
import React, { useContext } from "react";
import { ElementContextThread } from "../context/ThreadContext";
import useIndexedDB from '../hooks/useIndexedDB';
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
  const { getItems, saveItem, deleteItem } = useIndexedDB();
  const { changeValuePopUP } = useContext(ElementContextPopUp);
  const { changeActive, value, Title, Active, changeTitle, setActive, TitlePopUp } = useContext(ElementContextThread);
  const { userData } = useContext(AuthContext);
  const handleCancelButton = () => {
    changeValuePopUP("");
  };

  const UpdateName = () => {
    if(value === Active ){
      changeTitle(inputEdit.current.value);
    }
    changeValuePopUP("")
  }

  const handleEditThread =( ) => {

      fetch('https://kodexai-bigfoot.coolnerdypipol.com/back/api/v1/threads', {
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
      .then(response => {
        if (response.ok) {
          UpdateName()
        }
      })
        .catch(error => console.error('Error:', error));
      

      

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

    fetch('https://kodexai-bigfoot.coolnerdypipol.com/back/api/v1/threads', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.access_token}`
      },
      body: JSON.stringify({
        'thread_id': value
      })
    })
      .then(response => {
        if (response.ok) {
          if(Active === value){
            changeTitle("");
            setActive("");
            deleteDb();
          }
          
          changeValuePopUP("deleteSuccess");
          
        }
      })
      .catch(error => console.error('Error:', error));
      

  }

  const deleteDb = async ( ) => {
    let holder =  await getItems();
    let item = {};
    item.userData = holder[0].userData;
    item.ThreadId = "";
    item.ThreadName = "";
    deleteItem(holder[0].id);
    saveItem(item);
  }

  if(identifier === "new") {
    return (
      <div className="popUpContainer">
          <div className="popUpMessage">
          <div style={{paddingTop: "10px"}}>
          <p className="TitleText" style={{color: "black", paddingTop: "1%" , textAlign: "center"}}>Ingresa el título de la conversación</p>
          </div>

          <div className="inputPopUp"><input
            ref={inputNew}
            type="text"
            name="text"
            className="input"
          /></div>
          
          <div className="rowContainer" style={{width: "95%" , justifyContent: "space-between"}}>
          <button
            className="styleCancelButtonPopUpDesktop"
            onClick={() => {
              handleCancelButton();
            }}
          >
            <p className="buttonFont">Cancelar</p>
          </button>
          <button
            className="styleButtonPopUpDesktop"
            onClick={() => {
              handleNewThread();
            }}
          >
            <p className="buttonFont">Aceptar</p>
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
          <div style={{paddingTop: "10px"}}>
          <p className="TitleText" style={{color: "black", fontWeight: "bold", paddingTop: "1%", textAlign: "center"}}>¿Está seguro que desea eliminar la conversación? </p>
          </div>
          
          <div className="rowContainer" style={{width: "95%" , justifyContent: "space-between"}}>
          <button
            className="styleButtonPopUpDesktop"
            onClick={() => {
              handleCancelButton();
            }}
          >
            <p className="buttonFont">Cancelar</p>
          </button>
          <button
            className="styleCancelButtonPopUpDesktop"
            onClick={() => {
              handleEliminateThread();
            }}
          >
            <p className="buttonFont">Eliminar</p>
          </button>
          </div>
        </div>
      </div>
    );
  }

  if(identifier === "deleteSuccess"){
    return (
      <div className="popUpContainer">
          <div className="popUpMessage">
          <div style={{paddingTop: "10px"}}>
          <p className="TitleText" style={{color: "black", paddingTop: "1%", textAlign: "center"}}>Se ha eliminado con éxito</p>
          </div>

          <div className="rowContainer" style={{width: "95%" , justifyContent: "space-between"}}>
          <button
            className="styleButtonPopUpDesktop"
            onClick={() => {
              handleCancelButton();
            }}
          >
            <p className="buttonFont">Aceptar</p>
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
            <div style={{paddingTop: "10px"}}>
          <p className="TitleText" style={{color: "black", paddingTop: "1%", textAlign: "center"}}>Ingresa el título de la conversación</p>
          </div>
          <div className="inputPopUp"><input
            ref={inputEdit}
            type="text"
            name="text"
            placeholder={TitlePopUp}
            className="input"
            
          /></div>
          
          <div className="rowContainer" style={{width: "95%" , justifyContent: "space-between"}}>
          <button
            className="styleCancelButtonPopUpDesktop"
            onClick={() => {
              handleCancelButton();
            }}
          >
            <p className="buttonFont">Cancelar</p>
          </button>
          <button
            className="styleButtonPopUpDesktop"
            onClick={() => {
              handleEditThread();
            }}
          >
            <p className="buttonFont">Aceptar</p>
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
