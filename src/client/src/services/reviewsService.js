import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const reviewsServiceFactory = (token) => {
    const request = requestFactory(token);

    return {
        uploadReview: (data) => request.post(`${baseUrl}/Review/Upload`, data),
        getReviews: (placeId, page, order) => request.get(`${baseUrl}/Review/GetReviews?placeId=${placeId}&page=${page}&order=${order}`),
        likeReview: (reviewId) => request.post(`${baseUrl}/Review/Like?reviewId=${reviewId}`),
        dislikeReview: (reviewId) => request.delete(`${baseUrl}/Review/Dislike?reviewId=${reviewId}`),
    }
};