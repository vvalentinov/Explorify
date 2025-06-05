import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const favPlaceServiceFactory = (token) => {

    const request = requestFactory(token);

    return {
        addToFavorites: (placeId) => request.post(`${baseUrl}/FavoritePlace/Add?placeId=${placeId}`),
        removeFromFavorites: (placeId) => request.delete(`${baseUrl}/FavoritePlace/Remove?placeId=${placeId}`)
    }
};