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
        getProfileInfo: (userId) =>
            request.get(
                userId
                    ? `${baseUrl}/User/GetProfileInfo?userId=${userId}`
                    : `${baseUrl}/User/GetProfileInfo`
            ),
        followUser: (userId) => request.post(`${baseUrl}/Follow/${userId}`),
        unfollowUser: (userId) => request.delete(`${baseUrl}/Follow/${userId}`)
    }
};