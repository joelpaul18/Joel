/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(() => Boolean(localStorage.getItem('adminToken')));

    const login = (token) => {
        localStorage.setItem('adminToken', token);
        setIsAdmin(true);
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, setIsAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
