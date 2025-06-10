import { entityState } from "../../../constants/entityState";

export const initialState = {
    reviews: [],
    spinnerLoading: false,
    filter: entityState.Approved,
    pagesCount: 0,
    currentPage: 1,
    reviewsCount: 0,
    sortOption: "Newest",
    starFilters: [],
    isUploadReviewModalOpen: false,
};

export const reviewsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_REVIEWS':
            return {
                ...state,
                reviews: action.payload.reviews,
                reviewsCount: action.payload.reviewsCount,
                pagesCount: action.payload.pagesCount,
                spinnerLoading: false,
            };
        case 'SET_LOADING':
            return { ...state, spinnerLoading: true };
        case 'SET_FILTER':
            return { ...state, filter: action.payload, currentPage: 1 };
        case 'SET_SORT':
            return { ...state, sortOption: action.payload, currentPage: 1 };
        case 'SET_STAR_FILTERS':
            return { ...state, starFilters: action.payload, currentPage: 1 };
        case 'SET_PAGE':
            return { ...state, currentPage: action.payload };
        case 'TOGGLE_UPLOAD_MODAL':
            return { ...state, isUploadReviewModalOpen: action.payload };
        default:
            return state;
    }
}