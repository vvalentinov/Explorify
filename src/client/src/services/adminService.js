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
        getUnapprovedPlace: (placeId) => request.get(`${baseUrl}/Admin/GetUnapprovedPlace?placeId=${placeId}`),
        getApprovedPlaces: (page) => request.get(`${baseUrl}/Admin/GetApprovedPlaces?page=${page}`),
        getDeletedPlaces: (page) => request.get(`${baseUrl}/Admin/GetDeletedPlaces?page=${page}`),
        getPlaceInfo: (placeId) => request.get(`${baseUrl}/Admin/GetPlaceInfo?placeId=${placeId}`),
        unapprovePlace: (data) => request.put(`${baseUrl}/Admin/UnapprovePlace`, data),
        deletePlace: (data) => request.delete(`${baseUrl}/Admin/DeletePlace`, data),
        revertPlace: (placeId) => request.put(`${baseUrl}/Admin/RevertPlace`, placeId)
    }
};