import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const homeServiceFactory = (token) => {

    const request = requestFactory(token);

    return {
        getHomeData: () => request.get(`${baseUrl}/Home/GetData`),
    }
};