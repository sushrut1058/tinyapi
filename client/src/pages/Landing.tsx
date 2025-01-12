import React, { useContext, useEffect } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Landing = () => {
    const url = import.meta.env.VITE_API_URL
    const { login, accessToken } = useContext(AuthContext);

    const handleLogin = async (credentialResponse) => {
        try {
          const response = await fetch(`${url}/auth/login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({token: credentialResponse.credential})
          });
          const data = await response.json();
          if(response.ok){
            login(data);
            window.location.href = "/home";
          }else{
            console.log(data);
            console.log("Failed")
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      };
    
    return (
        !accessToken ?    
            <div>
                <GoogleLogin
                    onSuccess={(credentialResponse) => handleLogin(credentialResponse)}
                    onError={() => console.error("Login failed")}
                />
            </div>
        :
        <Navigate to="/home" />
    )
}

export default Landing;