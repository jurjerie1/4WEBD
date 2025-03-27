import {createContext, useContext, useState} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        // Récupérer les informations de l'utilisateur et le token depuis localStorage lors du chargement initial
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    });

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        // Stocker les informations de l'utilisateur et le token dans localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        // Supprimer les informations de l'utilisateur et le token de localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};