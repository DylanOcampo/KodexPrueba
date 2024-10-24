import "./login.css"
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Home } from './pages/Home';
import { LogIn } from './pages/LogIn';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import React, { useContext } from "react";
import { ElementContextPopUp } from "./context/PopUpContext";
import { PopUpPrefab } from "./components/PopUpPrefab";
import { Test } from "./pages/Test";


function App() {

  const { value } = useContext(ElementContextPopUp);

  return (
    <>
    <div className="Appcontainer">
      
        <Router>
          <Routes>
              <Route path= "" element={<LogIn></LogIn>}/>
              <Route path= "home" element={<Home></Home>}/>
          </Routes>

        </Router>

    </div>
    {value === "" ? null : <PopUpPrefab identifier={value}></PopUpPrefab>}
    </>
  );
}

export default App;
