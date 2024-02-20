
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = (decodedToken) => {
        console.log(decodedToken); // Add this line to inspect the decodedToken structure
        setUser(decodedToken);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userToken');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
