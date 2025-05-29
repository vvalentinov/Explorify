import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const homeServiceFactory = () => {

    const request = requestFactory();

    return {
        getHomeData: () => request.get(`${baseUrl}/Home/GetData`),
    }
};