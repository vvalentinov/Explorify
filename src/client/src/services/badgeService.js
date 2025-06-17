import { baseUrl } from '../constants/baseUrl';

import { requestFactory } from '../lib/requester';

export const badgesServiceFactory = (token) => {

    const request = requestFactory(token);

    return {
        getUserBadges: (userId) => request.get(`${baseUrl}/Badge/GetUserBadges?userId=${userId}`),
    }
};