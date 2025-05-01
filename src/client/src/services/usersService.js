import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const usersServiceFactory = (token) => {
    const request = requestFactory(token);

    return {
        changeUserName: (data) => request.post(`${baseUrl}/User/ChangeUsername`, data),
    }
};