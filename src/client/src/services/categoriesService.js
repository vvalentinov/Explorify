import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const categoriesServiceFactory = () => {
    const request = requestFactory();

    return {
        getCategories: () => request.get(`${baseUrl}/Category/GetCategories`),
        getSubcategories: (categoryId) => request.get(`${baseUrl}/Category/GetSubcategories?categoryId=${categoryId}`),
        getSubcategoriesBySlugName: (categoryName) => request.get(`${baseUrl}/Category/GetSubcategoriesBySlugName?categoryName=${categoryName}`),
        getCategoriesOptions: () => request.get(`${baseUrl}/Category/GetCategoryOptions`)
    }
};