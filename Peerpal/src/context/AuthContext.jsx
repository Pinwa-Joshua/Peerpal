import { createContext, useContext, useState, useEffect } from 'react';
import { AuthAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const userData = await AuthAPI.getMe();
                    setUser(userData);
                } catch (error) {
                    console.error("Token invalid or expired", error);
                    localStorage.removeItem('access_token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password, role) => {
        const response = await AuthAPI.login({ email, password, role });
        localStorage.setItem('access_token', response.access_token);
        const userData = await AuthAPI.getMe();
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
    };

    const refreshUser = async () => {
        const userData = await AuthAPI.getMe();
        setUser(userData);
        return userData;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, isLoading: loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
