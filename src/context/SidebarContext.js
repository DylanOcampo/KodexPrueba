import React, { createContext, useState } from "react";

const ElementContextSidebar = createContext();

const ElementProviderSidebar = ({ children }) => {
  const [valueSB, setValue] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const changeValueSideBar = (newValue) => {
    setValue(newValue);
  };

  return (
    <ElementContextSidebar.Provider value={{ valueSB, changeValueSideBar, scrollPos, setScrollPos  }}>
      {children}
    </ElementContextSidebar.Provider>
  );
};

export { ElementContextSidebar, ElementProviderSidebar };
