import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const categoriesServiceFactory = () => {
    const request = requestFactory();

    return {
        getCategories: () => request.get(`${baseUrl}/Category/GetCategories`),
        getSubcategories: (categoryId) => request.get(`${baseUrl}/Category/GetSubcategories?categoryId=${categoryId}`),
        getSubcategoriesByName: (categoryName) => request.get(`${baseUrl}/Category/GetSubcategoriesByName?categoryName=${categoryName}`)
    }
};