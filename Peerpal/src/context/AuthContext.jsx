import { createContext, useContext, useState, useEffect } from 'react';
import { AuthAPI } from '../services/api';

const AuthContext = createContext(null);
const PROFILE_STORAGE_PREFIX = 'peerpal_profile_';

const mergeStoredProfile = (userData) => {
    if (!userData?.id) return userData;

    try {
        const stored = localStorage.getItem(`${PROFILE_STORAGE_PREFIX}${userData.id}`);
        if (!stored) return userData;

        const parsed = JSON.parse(stored);
        return {
            ...userData,
            ...parsed,
            id: userData.id,
            email: userData.email,
            full_name: userData.full_name ?? parsed.full_name,
            role: userData.role,
        };
    } catch (error) {
        console.error("Failed to read stored profile", error);
        return userData;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const userData = await AuthAPI.getMe();
                    setUser(mergeStoredProfile(userData));
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
        setUser(null);
        const response = await AuthAPI.login({ email, password, role });
        localStorage.setItem('access_token', response.access_token);
        const userData = await AuthAPI.getMe();
        const mergedUser = mergeStoredProfile(userData);
        setUser(mergedUser);
        return mergedUser;
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
    };

    const refreshUser = async () => {
        const userData = await AuthAPI.getMe();
        const mergedUser = mergeStoredProfile(userData);
        setUser(mergedUser);
        return mergedUser;
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
