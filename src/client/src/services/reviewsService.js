import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const reviewsServiceFactory = (token) => {
    const request = requestFactory(token);

    return {
        uploadReview: (data) => request.post(`${baseUrl}/Review/Upload`, data),
    }
};