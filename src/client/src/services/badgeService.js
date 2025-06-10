import { baseUrl } from '../constants/baseUrl';

import { requestFactory } from '../lib/requester';

export const badgesServiceFactory = (token) => {

    const request = requestFactory(token);

    return {
        getUserBadges: () => request.get(`${baseUrl}/Badge/GetUserBadges`),
    }
};