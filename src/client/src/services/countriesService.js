import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const countriesServiceFactory = () => {
    const request = requestFactory();

    return {
        getCountries: (nameFilter) => request.get(`${baseUrl}/Country/GetCountries?nameFilter=${nameFilter}`),
    }
};