import { base } from 'framer-motion/client';
import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const adminServiceFactory = (token) => {

    const request = requestFactory(token);

    return {
        getDashboardInfo: () => request.get(`${baseUrl}/Admin/GetDashboardInfo`),
        getUnapprovedPlaces: () => request.get(`${baseUrl}/Admin/GetUnapprovedPlaces`),
        approvePlace: (placeId) => request.put(`${baseUrl}/Admin/ApprovePlace?placeId=${placeId}`)
    }
};