import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const placesServiceFactory = (token) => {
    const request = requestFactory(token);

    return {
        uploadPlace: (data) => request.post(`${baseUrl}/Place/Upload`, data),
    }
};