import { baseUrl } from '../constants/baseUrl';

import { requestFactory } from '../lib/requester';

export const adminServiceFactory = (token) => {

    const request = requestFactory(token);

    return {
        getDashboardInfo: () => request.get(`${baseUrl}/Admin/GetDashboardInfo`),
        approvePlace: (placeId) => request.put(`${baseUrl}/Admin/ApprovePlace?placeId=${placeId}`),
        approveReview: (reviewId) => request.put(`${baseUrl}/Admin/ApproveReview?reviewId=${reviewId}`),
        unapprovePlace: (data) => request.put(`${baseUrl}/Admin/UnapprovePlace`, data),
        unapproveReview: (data) => request.put(`${baseUrl}/Admin/UnapproveReview`, data),
        getUsers: (page) => request.get(`${baseUrl}/Admin/GetUsers?page=${page}`),
        makeAdmin: (userId) => request.put(`${baseUrl}/Admin/MakeUserAdmin?userId=${userId}`)
    }
};