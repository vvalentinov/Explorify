import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const reviewsServiceFactory = (token) => {

    const request = requestFactory(token);

    return {
        uploadReview: (data) => request.post(`${baseUrl}/Review/Upload`, data),
        likeReview: (reviewId) => request.post(`${baseUrl}/Review/Like?reviewId=${reviewId}`),
        dislikeReview: (reviewId) => request.delete(`${baseUrl}/Review/Dislike?reviewId=${reviewId}`),
        getPlaceReviews: (placeId, page, order, starsFilter) => {
            const queryParams = new URLSearchParams();

            queryParams.append('placeId', placeId);
            queryParams.append('page', page);
            queryParams.append('order', order);

            // Append each star as a separate query param: &starsFilter=1&starsFilter=5
            if (Array.isArray(starsFilter)) {
                starsFilter.forEach(star => {
                    queryParams.append('starsFilter', star);
                });
            }

            return request.get(`${baseUrl}/Review/GetReviewsForPlace?${queryParams}`);
        },
        getApproved: (page, isForAdmin, order, starsFilter) => {
            const queryParams = new URLSearchParams();

            queryParams.append('page', page);
            queryParams.append('isForAdmin', isForAdmin);
            queryParams.append('order', order);

            // Append each star as a separate query param: &starsFilter=1&starsFilter=5
            if (Array.isArray(starsFilter)) {
                starsFilter.forEach(star => {
                    queryParams.append('starsFilter', star);
                });
            }

            return request.get(`${baseUrl}/Review/GetApproved?${queryParams}`);
        },
        getUnapproved: (page, isForAdmin, order, starsFilter) => {
            const queryParams = new URLSearchParams();

            queryParams.append('page', page);
            queryParams.append('isForAdmin', isForAdmin);
            queryParams.append('order', order);

            if (Array.isArray(starsFilter)) {
                starsFilter.forEach(star => {
                    queryParams.append('starsFilter', star);
                });
            }

            return request.get(`${baseUrl}/Review/GetUnapproved?${queryParams}`);
        },
        getDeleted: (page, isForAdmin, order, starsFilter) => {
            const queryParams = new URLSearchParams();

            queryParams.append('page', page);
            queryParams.append('isForAdmin', isForAdmin);
            queryParams.append('order', order);

            if (Array.isArray(starsFilter)) {
                starsFilter.forEach(star => {
                    queryParams.append('starsFilter', star);
                });
            }

            return request.get(`${baseUrl}/Review/GetDeleted?${queryParams}`);
        },
        deleteReview: (data) => request.delete(`${baseUrl}/Review/Delete`, data),
        revertReview: (reviewId) => request.put(`${baseUrl}/Review/Revert?reviewId=${reviewId}`),
        getEditInfo: (reviewId) => request.get(`${baseUrl}/Review/GetEditInfo?reviewId=${reviewId}`),
        edit: (data) => request.put(`${baseUrl}/Review/Edit`, data),
        getFollowedUserReviews: (page, order, starsFilter, followingUserId) => {

            const queryParams = new URLSearchParams();

            queryParams.append('page', page);
            queryParams.append('followingUserId', followingUserId);
            queryParams.append('order', order);

            if (Array.isArray(starsFilter)) {
                starsFilter.forEach(star => {
                    queryParams.append('starsFilter', star);
                });
            }

            return request.get(`${baseUrl}/Review/GetReviewsForFollowedUser?${queryParams}`);
        },
    }
};