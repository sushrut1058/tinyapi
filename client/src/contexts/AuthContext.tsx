import React, {useState, useEffect, createContext} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [accessToken,setAccessToken] = useState(()=>localStorage.getItem('access_token'));
    const [user, setUser] = useState(()=>localStorage.getItem('email'));
    
    console.log(user, accessToken);

    const validateToken = async () => {
        try{    
            const url = import.meta.env.VITE_API_URL;
            const resp = await fetch(`${url}/auth/status/`,{
                'method':'GET',
                'headers': {
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${accessToken}`
                }
            });
            if (resp.ok) return true;
            else logout();
        } catch (e) {
            console.log(e);
            logout()
        }
    }

    useEffect(()=>{validateToken();},[])
    
    const login = (data) => {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('name', data.user.name);
        setUser(data.user.email);
        setAccessToken(data.access_token);
    }

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
    }

    return (
        <AuthContext.Provider value={{accessToken, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;