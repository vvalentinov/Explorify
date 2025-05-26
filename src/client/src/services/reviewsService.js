import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const reviewsServiceFactory = (token) => {
    const request = requestFactory(token);

    return {
        uploadReview: (data) => request.post(`${baseUrl}/Review/Upload`, data),
        likeReview: (reviewId) => request.post(`${baseUrl}/Review/Like?reviewId=${reviewId}`),
        dislikeReview: (reviewId) => request.delete(`${baseUrl}/Review/Dislike?reviewId=${reviewId}`),
        getPlaceReviews: (placeId, page, order) => request.get(`${baseUrl}/Review/GetReviewsForPlace?placeId=${placeId}&page=${page}&order=${order}`),
        getApproved: (page, isForAdmin) => request.get(`${baseUrl}/Review/GetApproved?page=${page}&isForAdmin=${isForAdmin}`),
        getUnapproved: (page, isForAdmin) => request.get(`${baseUrl}/Review/GetUnapproved?page=${page}&isForAdmin=${isForAdmin}`),
        getDeleted: (page, isForAdmin) => request.get(`${baseUrl}/Review/GetDeleted?page=${page}&isForAdmin=${isForAdmin}`),
        deleteReview: (data) => request.delete(`${baseUrl}/Review/Delete`, data),
        revertReview: (reviewId) => request.put(`${baseUrl}/Review/Revert?reviewId=${reviewId}`)
    }
};