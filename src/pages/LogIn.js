import { useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import Button from 'react-bootstrap/Button';
import { AuthContext } from './AuthContext';
import logo from "../img/kodexLogo.png";


export const LogIn = () => {

    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const inputRefEmail = useRef(null);
    const inputRefPassword = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const {changeUserData} = useContext(AuthContext);


    const gotToNewPage= async ()=>{
        if(inputRefEmail.current.value.trim() !== "" && inputRefPassword.current.value.trim() !== ""){
            const response = fetch(" https://kodexai-bigfoot.coolnerdypipol.com/back/api/v1/login",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: inputRefEmail.current.value,
                    password: inputRefPassword.current.value,
                })
            })
            .then(response => {
                if (!response.ok) {
                    setIsVisible(true);
                    throw new Error(`Error del servidor`);
                }
                return response.json();
                })
            .then(data => {
                console.log(data);
                changeUserData(data);
            })
            .catch(error => console.error('Error:', error));
        }else{
            setIsVisible(true);
        }
    }


    const [errorMessage, setErrorMessage] = useState(true)

    return (
        <div style={{display:"flex", width: "100vw", height: "100vh", justifyContent: "center", alignItems: "center", backgroundColor: "#282828"}}>
                <div className="LoginContainer">
                <h1 ><img src={logo} style={{width: "15vw", justifyContent: "center", alignContent: "center"}}></img></h1>
                    <h4 className="subText" style={{fontSize: "25px"}}>Iniciar sesión</h4>
                    <div className="input-container">
                        <input placeholder="Introducir correo electrónico" type="email" ref={inputRefEmail}/>
                        <span>
                            <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                            </svg>
                        </span>
                    </div>
                <div class="input-container">
                    <div style={{paddingBottom: "10px"}}>
                    <input  placeholder="Introducir contraseña" type="password" ref={inputRefPassword}/>
                    </div>
                    <span style={{paddingBottom: "10px" }}>
                        <svg stroke="currentColor" xmlns="http://www.w3.org/2000/svg" fill="#838383" viewBox="0 0 64 64">
                        <path d="M 32 9 C 24.832 9 19 14.832 19 22 L 19 27.347656 C 16.670659 28.171862 15 30.388126 15 33 L 15 49 C 15 52.314 17.686 55 21 55 L 43 55 C 46.314 55 49 52.314 49 49 L 49 33 C 49 30.388126 47.329341 28.171862 45 27.347656 L 45 22 C 45 14.832 39.168 9 32 9 z M 32 13 C 36.963 13 41 17.038 41 22 L 41 27 L 23 27 L 23 22 C 23 17.038 27.037 13 32 13 z M 21 31 L 43 31 C 44.105 31 45 31.895 45 33 L 45 49 C 45 50.105 44.105 51 43 51 L 21 51 C 19.895 51 19 50.105 19 49 L 19 33 C 19 31.895 19.895 31 21 31 z"></path>
                        </svg>
                    </span>
                    </div>
                    {errorMessage ? <div className={isVisible ? "" : "d-none"}><p className="errorMessage">Usuario o contraseña incorrecto</p></div> : null}
                    <Button className="" variant="secondary" style={{width: "100%", height:"46px", backgroundColor: "#d2ff04", color: "black", fontWeight: "bold", borderColor: "#d2ff04"}} onClick={() => gotToNewPage()}><p className="buttonText">Iniciar sesión</p></Button>


                </div>

        </div>
    )
}