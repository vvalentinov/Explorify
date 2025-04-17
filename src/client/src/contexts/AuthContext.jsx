import { createContext } from 'react';

import { useLocalStorage } from '../hooks/useLocalStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useLocalStorage('auth', {});

    const userLogin = (data) => setAuth(data);
    const userLogout = () => setAuth({});

    const contextValue = {
        userLogin,
        userLogout,
        token: auth.accessToken,
        userId: auth.userId,
        isAdmin: auth.isAdmin,
        username: auth.userName,
        isAuthenticated: !!auth.accessToken,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};