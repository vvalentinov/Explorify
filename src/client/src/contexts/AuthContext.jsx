import { createContext, useState, useEffect } from 'react';

import { useLocalStorage } from '../hooks/useLocalStorage';

export const AuthContext = createContext();

import { baseUrl } from '../constants/baseUrl';

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useLocalStorage('auth', {});

    const userLogin = (data) => setAuth(data);
    const userLogout = () => setAuth({});

    // const [auth, setAuth] = useState({});

    // const userLogin = (data) => setAuth(data);
    // const userLogout = () => setAuth({});

    // const tryRefreshLogin = async () => {
    //     try {
    //         const response = await fetch(`${baseUrl}/user/refresh`, {
    //             method: 'POST',
    //             credentials: 'include'
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             userLogin(data);
    //         } else {
    //             userLogout(); // Optional, in case user had expired refresh token
    //         }
    //     } catch (err) {
    //         console.error('Auto-login failed', err);
    //         userLogout();
    //     }
    //     // finally {
    //     //     setLoading(false);
    //     // }
    // };

    // // Auto-login using refresh token on first mount
    // useEffect(() => {
    //     tryRefreshLogin();
    // }, []);

    const contextValue = {
        userLogin,
        userLogout,
        token: auth.accessToken,
        userId: auth.userId,
        isAdmin: auth.isAdmin,
        userName: auth.userName,
        isAuthenticated: !!auth.accessToken,
        profileImageUrl: auth.profileImageUrl
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};