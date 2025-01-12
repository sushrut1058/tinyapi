import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AuthContext from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { accessToken } = useContext(AuthContext);

    return accessToken ? 
        <div className="min-h-screen bg-gray-950">
            <Sidebar />
            <Header />
            <main className="pt-16 pl-16">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div> 
    : <Navigate to="/" />;
};

export default PrivateRoute;
