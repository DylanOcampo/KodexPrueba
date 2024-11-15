import React, { createContext, useState } from "react";

const ElementContextAni = createContext();

const ElementProviderAni = ({ children }) => {
  const [valueAni, setValueAni] = useState(false);
  const [AniStop, setAniStop] = useState(false);
  const changeValueAni = (newValue) => {
    setValueAni(newValue);
  };

  const changeAniStop = (newValue) => {
    setAniStop(newValue);
  };

  return (
    <ElementContextAni.Provider value={{ valueAni, changeValueAni, changeAniStop, AniStop  }}>
      {children}
    </ElementContextAni.Provider>
  );
};

export { ElementContextAni, ElementProviderAni };
