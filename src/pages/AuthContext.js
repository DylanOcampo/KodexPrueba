import React, { createContext, useEffect, useState } from 'react';
import useIndexedDB from '../hooks/useIndexedDB';
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [hasInfoBD, setHasInfoBd] = useState(false);
  const { saveItem, getItems, deleteItem } = useIndexedDB();
  const [flag, setFlag] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if(userData=== null || userData===undefined) {
      console.log("2");
      const fetchItems = async () => {
        const savedItems = await getItems();
        if (savedItems !== undefined) {
          console.log("3");
          setFlag(false);
          if(savedItems.length === 1) {
            setHasInfoBd(true);
            fetch('http://165.22.178.7/back/api/v1/openaikey', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${savedItems[0].userData.access_token}`,
              },
              
            })
            .then(response => {
              if (!response.ok) {
              throw new Error(`Error del servidor`);
            }
            return response.json();
            })
              .then(data => {
                savedItems[0].userData.open_ia_key = data.open_ia_key;
                setUserData(savedItems[0].userData);
                
              })
              .catch(error => {console.error('Error:', error)
                setHasInfoBd(false);
              });

          }
          if(savedItems.length > 1){
            CleanDb();
          }
        }
      };
      if(flag){
        fetchItems();
      }
    }
    
    
  }, [getItems()]); // 

  useEffect(() => {

    if(userData!== null && userData!==undefined){
      navigate("/home");
    }
    
  }, [userData])

  const CleanDb = async ()  => {
    const savedItems = await getItems();
    if(savedItems.length > 1){
      for (let index = 0; index < savedItems.length; index++) {
        await deleteItem(savedItems[index].id);
      }
    }
  }

  const changeUserData = (newValue) => {

    let items = {}
    items.userData = newValue;
    items.ThreadName = "";
    items.ThreadId = "";
    items.userData.open_ia_key = "";
    saveItem(items)

    fetch('http://165.22.178.7/back/api/v1/openaikey', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${newValue.access_token}`,
      },
      
    })
    .then(response => {
      if (!response.ok) {
      throw new Error(`Error del servidor`);
    }
    return response.json();
    })
      .then(data => {
        newValue.open_ia_key = data.open_ia_key;
        console.log(newValue);
        setUserData(newValue);

      })
      .catch(error => {console.error('Error:', error)

      });

  };

  const fetchItems = async () => {
    const savedItems = await getItems();
    if (savedItems !== undefined) {
      console.log("3");
      setFlag(false);
      if(savedItems.length === 1) {
        setHasInfoBd(true);
        fetch('http://165.22.178.7/back/api/v1/openaikey', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${savedItems[0].userData.access_token}`,
          },
          
        })
        .then(response => {
          if (!response.ok) {
          throw new Error(`Error del servidor`);
        }
        return response.json();
        })
          .then(data => {
            savedItems[0].userData.open_ia_key = data.open_ia_key;
            setUserData(savedItems[0].userData);
            
          })
          .catch(error => {console.error('Error:', error)
            setHasInfoBd(false);
          });

      }
      if(savedItems.length > 1){
        CleanDb();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ userData, changeUserData, hasInfoBD, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};