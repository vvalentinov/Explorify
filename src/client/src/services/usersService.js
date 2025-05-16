import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const usersServiceFactory = (token) => {

    const request = requestFactory(token);

    return {
        changeUserName: (data) => request.post(`${baseUrl}/User/ChangeUsername`, data),
        changePassword: (data) => request.post(`${baseUrl}/User/ChangePassword`, data),
        changeEmail: (data) => request.post(`${baseUrl}/User/RequestEmailChange`, data),
        forgotPassword: (data) => request.post(`${baseUrl}/User/ForgotPassword`, data),
        resetPassword: (data) => request.post(`${baseUrl}/User/ResetPassword`, data),
        changeProfileImage: (data) => request.post(`${baseUrl}/User/ChangeProfilePicture`, data),
        getProfileInfo: () => request.get(`${baseUrl}/User/GetProfileInfo`),
        getUserPlaces: (page) => request.get(`${baseUrl}/User/GetPlaces?page=${page}`)
    }
};