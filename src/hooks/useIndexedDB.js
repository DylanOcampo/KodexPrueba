import { useState, useEffect, useContext } from 'react';


const DB_NAME = 'Kodex';
const DB_VERSION = 1;
const OBJECT_STORE_NAME = 'info';
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const useIndexedDB = () => {


  const [db, setDb] = useState(null);

  useEffect(() => {
    const initializeDB = async () => {
      const database = await openDatabase();
      setDb(database);
    };
    initializeDB();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      if (db) {
        const items = await getItems();
      }
    };
    fetchItems();
  }, [db]); 

  const saveItem = async (item) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([OBJECT_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
      const request = objectStore.add(item);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const updateItem = async (item) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([OBJECT_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
      const request = objectStore.put(item);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const getItems = async () => {
    if (db === null) {
      return;
    }
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([OBJECT_STORE_NAME]);
      const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const deleteItem = async (id) => {
    if (db === null) {
      return;
    }
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([OBJECT_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve(id);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  return { saveItem, getItems, deleteItem, updateItem };
};

export default useIndexedDB;
