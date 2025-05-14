import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const vibesServiceFactory = (token) => {

    const request = requestFactory(token);

    return {
        getVibes: () => request.get(`${baseUrl}/PlaceVibes/GetVibes`),
    }
};