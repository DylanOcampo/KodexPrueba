import React, { createContext, useState, useContext, useEffect } from "react";
import { ElementContextPopUp } from "../context/PopUpContext";
import useIndexedDB from '../hooks/useIndexedDB';
const ElementContextThread = createContext();

const ElementProviderThread= ({ children }) => {
  const { changeValuePopUP } = useContext(ElementContextPopUp);
  const [value, setValue] = useState("");
  const { getItems, saveItem, deleteItem } = useIndexedDB();
  const [flag, setFlag] = useState(true);
  const [Active, setActive] = useState("");
  const [Title, setTitle] = useState("");
  const [TitlePopUp, setTitlePopUp] = useState("");

  const changeValueThread = (newValue) => {
    setValue(newValue);
  };

  const changeTitle = (newValue) => {
    setTitle(newValue);
  }

  const changeTitlePopUp = (newValue) => {
    setTitlePopUp(newValue);
  }

  useEffect(() => {
    const fetchItems = async () => {
      const savedItems = await getItems();
      if (savedItems !== undefined) {
        setFlag(false);
        if(savedItems.length > 0) {
          setActive(savedItems[0].ThreadId);
          setTitle(savedItems[0].ThreadName);
          console.log(savedItems[0]);
        }
        
      }
    };
    if(flag){
      fetchItems();
    }
    
  }, [getItems()]); 

  const changeActive = (newValue, newTitle, newLastMessage,token ) => {


    fetch('https://kodexai-bigfoot.coolnerdypipol.com/back/api/v1/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        "thread_id": newValue,
        "title": newTitle,
        "last_message": newLastMessage
      })
    })
    .then(response => {
      if (response.ok) {
        setActive(newValue)
        setTitle(newTitle)
        changeValuePopUP("");
      }
    })
      .catch(error => console.error('Error:', error));
    

  };


  const updateActive= async (newValue, newTitle) => {

    setActive(newValue);
    setTitle(newTitle);
    let item = {};
    let holder =  await getItems();
    item.userData = holder[0].userData;
    item.ThreadId = newValue;
    item.ThreadName = newTitle;
    deleteItem(holder[0].id);
    saveItem(item);
  };

  return (
    <ElementContextThread.Provider value={{ value, changeValueThread, Active, changeActive, updateActive, Title, changeTitle, setActive, changeTitlePopUp, TitlePopUp  }}>
      {children}
    </ElementContextThread.Provider>
  );
};

export { ElementContextThread, ElementProviderThread };
