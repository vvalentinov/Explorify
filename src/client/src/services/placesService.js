import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const placesServiceFactory = (token) => {

    const request = requestFactory(token);

    return {
        uploadPlace: (data) => request.post(`${baseUrl}/Place/Upload`, data),
        getPlacesInSubcategory: (subcategoryId, page) => request.get(`${baseUrl}/Place/GetPlacesInSubcategory?subcategoryId=${subcategoryId}&page=${page}`),
        getPlaceDetailsById: (placeId, isForAdmin) => request.get(`${baseUrl}/Place/GetPlaceDetailsById?placeId=${placeId}&isForAdmin=${isForAdmin}`),
        getPlaceDetailsBySlugifiedName: (name) => request.get(`${baseUrl}/Place/GetPlaceDetailsBySlugifiedName?slugifiedName=${name}`),
        deletePlace: (data) => request.delete(`${baseUrl}/Place/Delete`, data),
        getEditData: (placeId) => request.get(`${baseUrl}/Place/GetEditData?placeId=${placeId}`),
        editPlace: (data) => request.put(`${baseUrl}/Place/Edit`, data),
        revertPlace: (placeId) => request.put(`${baseUrl}/Place/Revert?placeId=${placeId}`),
        getApproved: (page, isForAdmin) => request.get(`${baseUrl}/Place/GetApproved?page=${page}&isForAdmin=${isForAdmin}`),
        getUnapproved: (page, isForAdmin) => request.get(`${baseUrl}/Place/GetUnapproved?page=${page}&isForAdmin=${isForAdmin}`),
        getDeleted: (page, isForAdmin) => request.get(`${baseUrl}/Place/GetDeleted?page=${page}&isForAdmin=${isForAdmin}`),
        searchPlace: (queryParms) => request.get(`${baseUrl}/Place/Search?${queryParms}`),
        getPlaceWeatherData: (placeId) => request.get(`${baseUrl}/Place/GetPlaceWeatherInfo?placeId=${placeId}`)
    }
};