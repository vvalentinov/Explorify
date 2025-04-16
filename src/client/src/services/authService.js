import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const authServiceFactory = () => {
    const request = requestFactory();

    return {
        login: (data) => request.post(`${baseUrl}/User/Login`, data),
        register: (data) => request.post(`${baseUrl}/User/Register`, data)
    }
};