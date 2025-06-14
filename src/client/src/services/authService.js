import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const authServiceFactory = () => {

    const request = requestFactory();

    return {
        login: (data) => request.post(`${baseUrl}/Identity/Login`, data),
        register: (data) => request.post(`${baseUrl}/Identity/Register`, data),
        loginWithGoogle: () => {
            const returnUrl = encodeURIComponent(`${window.location.origin}/auth/google/callback`);
            window.location.href = `${baseUrl}/Identity/LoginGoogle?returnUrl=${returnUrl}`;
        }
    }

};