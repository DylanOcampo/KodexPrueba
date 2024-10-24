import { useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import Button from 'react-bootstrap/Button';
import { AuthContext } from './AuthContext';

export const LogIn = () => {

    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const inputRefEmail = useRef(null);
    const inputRefPassword = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const {setUserData} = useContext(AuthContext);
    const gotToNewPage= async ()=>{
        console.log("1");
        console.log(inputRefEmail.current.value);
            if(inputRefEmail.current.value.trim() !== "" && inputRefPassword.current.value.trim() !== ""){
                    const response = fetch("http://165.22.178.7/api/v1/login",{
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
                        setUserData(data);
                    })
                    .then(data => navigate("/home"))
                    .catch(error => console.error('Error:', error));
            }else{
                setIsVisible(true);
            }
    }


    const [errorMessage, setErrorMessage] = useState(true)

    return (
        <div style={{display:"flex", width: "100vw", height: "100vh", justifyContent: "center", alignItems: "center", backgroundColor: "#EEEEF8"}}>
                <div class="form">
                <p class="form-title">Bienvenido</p>
                    <p class="form-text">Inicia sesión en tu cuenta</p>
                    <div class="input-container">
                        <input placeholder="Introducir correo electrónico" type="email" ref={inputRefEmail}/>
                        <span>
                            <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                            </svg>
                        </span>
                    </div>
                <div class="input-container">
                    <input placeholder="Introducir contraseña" type="password" ref={inputRefPassword}/>

                    <span>
                        <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                        </svg>
                    </span>
                    </div>
                    {errorMessage ? <div className={isVisible ? "" : "d-none"}><p className="errorMessage">Check your password or account</p></div> : null}
                    <Button className="" variant="secondary" style={{width: "100%", height:"46px", backgroundColor: "#030617"}} onClick={() => gotToNewPage()}>Iniciar sesión</Button>


                </div>

        </div>
    )
}