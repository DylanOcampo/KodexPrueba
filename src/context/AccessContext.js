import React, { createContext, useState } from "react";

const ElementContextAccess = createContext();

const ElementProviderAccess= ({ children }) => {
  const [valueToken, setValueToken] = useState("");
  const [valueApiKey, setValueApiKey] = useState("");
  const changeValueToken = (newValue) => {
    console.log( newValue);
    setValueToken(newValue);
  };

  const changeApiKey = (newValue) => {
    console.log( newValue);
    setValueApiKey(newValue);
  };

  return (
    <ElementContextAccess.Provider value={{ valueToken, changeValueToken, valueApiKey, changeApiKey}}>
      {children}
    </ElementContextAccess.Provider>
  );
};

export { ElementContextAccess, ElementProviderAccess };
