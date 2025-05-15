import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const adminServiceFactory = (token) => {

    const request = requestFactory(token);

    return {
        getDashboardInfo: () => request.get(`${baseUrl}/Admin/GetDashboardInfo`),
        getUnapprovedPlaces: (page) => request.get(`${baseUrl}/Admin/GetUnapprovedPlaces?page=${page}`),
        approvePlace: (placeId) => request.put(`${baseUrl}/Admin/ApprovePlace?placeId=${placeId}`),
        approveReview: (reviewId) => request.put(`${baseUrl}/Admin/ApproveReview?reviewId=${reviewId}`),
        getUnapprovedReviews: (page) => request.get(`${baseUrl}/Admin/GetUnapprovedReviews?page=${page}`),
    }
};