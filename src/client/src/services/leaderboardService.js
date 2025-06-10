import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const leaderboardServiceFactory = () => {

    const request = requestFactory();

    return {
        getInfo: (page) => request.get(`${baseUrl}/Leaderboard/GetInfo?page=${page}`),
        search: (userName, page) => request.get(`${baseUrl}/Leaderboard/Search?userName=${userName}&page=${page}`)
    }
};