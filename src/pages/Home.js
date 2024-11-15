
import { Sidebar } from "../components/Sidebar.js"
import {ChatBox} from "../components/ChatBox.js"
import { AuthContext } from "../pages/AuthContext";
import React, { useContext } from "react";


import { useNavigate } from "react-router-dom";
export const Home = () => {

    const { userData, hasInfoBD } = useContext(AuthContext);

    const navigate = useNavigate();


    if(userData=== null || userData===undefined) {
        if(hasInfoBD){
          return <></>;
        }else{
          return <div className="popUpContainer">
            <div className="popUpMessage">
            <h3 style={{color: "black", fontWeight: "bold", paddingTop: "1%", textAlign: "center"}}>Porfavor vuelva a iniciar sesión </h3>

            <div className="rowContainer" style={{width: "100%" , height: "40%", justifyContent: "space-evenly", paddingTop: "5%"}}>
            <button
              className="styleCancelButtonPopUpDesktop"
              onClick={() => {
                navigate("/");
              }}
            >
              <h3 className="buttonFont">Aceptar</h3>
            </button>
            </div>
          </div>
        </div>;
        }
        
    }


    return (
        <div className="rowContainer" style={{maxWidth: "100vw", maxHeight: "100vh", minWidth: "100vw", minHeight: "100vh"}}>
            <Sidebar></Sidebar>
            <ChatBox></ChatBox>
        </div>
    )
}