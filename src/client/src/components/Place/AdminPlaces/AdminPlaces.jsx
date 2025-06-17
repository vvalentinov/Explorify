import styles from './AdminPlaces.module.css';

import { vibesServiceFactory } from '../../../services/vibesService';
import { placesServiceFactory } from '../../../services/placesService';
import { countriesServiceFactory } from '../../../services/countriesService';
import { categoriesServiceFactory } from '../../../services/categoriesService';

import { useState, useEffect, useContext, useReducer, useRef } from "react";

import { useDebounce } from 'use-debounce';

import PlacesList from '../PlacesList/PlacesList';
import PlaceSearchCard from '../PlaceSearchCard/PlaceSearchCard';

import { fireError } from "../../../utils/fireError";
import { AuthContext } from '../../../contexts/AuthContext';
import { PlaceSearchContext } from '../../../constants/placeSearchContext';

import {
    mapCategoriesOptions,
    mapCountryOptions,
    mapTagsOptions,
} from '../UploadPlace/uploadPlaceUtil';

const initialState = {
    placeName: '',
    selectedTagIds: [],
    selectedCategoryPath: [],
    selectedCountryId: null,
    filter: 'Approved',
    currentPage: 1,
    countrySearch: '',
    openCountryDropdown: false,
    countryLoading: false,
    searchContext: PlaceSearchContext.Admin,
    recordsCount: 0,
};

function filtersReducer(state, action) {
    switch (action.type) {
        case 'SET_PLACE_NAME':
            return { ...state, placeName: action.payload, currentPage: 1 };
        case 'SET_RECORDS_COUNT':
            return { ...state, recordsCount: action.payload };
        case 'SET_TAGS':
            return { ...state, selectedTagIds: action.payload, currentPage: 1 };
        case 'SET_CATEGORY':
            return { ...state, selectedCategoryPath: action.payload, currentPage: 1 };
        case 'SET_COUNTRY':
            return { ...state, selectedCountryId: action.payload, currentPage: 1 };
        case 'SET_FILTER':
            return { ...state, filter: action.payload, currentPage: 1 };
        case 'SET_PAGE':
            return { ...state, currentPage: action.payload };
        case 'SET_COUNTRY_SEARCH':
            return { ...state, countrySearch: action.payload };
        case 'SET_COUNTRY_LOADING':
            return { ...state, countryLoading: action.payload };
        case 'SET_OPEN_COUNTRY_DROPDOWN':
            return { ...state, openCountryDropdown: action.payload };
        case 'SET_SEARCH_CONTEXT':
            return { ...state, searchContext: action.payload };
        case 'RESET':
            return { ...initialState };
        default:
            return state;
    }
}

import AdminPlaceSearchCard from './AdminPlacesSearchCard';

import Pagination from '../../Pagination/Pagination';

const AdminPlaces = () => {

    const { token } = useContext(AuthContext);

    // Services
    const vibesService = vibesServiceFactory();
    const placesService = placesServiceFactory(token);
    const countriesService = countriesServiceFactory();
    const categoriesService = categoriesServiceFactory();

    const [places, setPlaces] = useState([]);
    const [pagesCount, setPagesCount] = useState(0);
    const [spinnerLoading, setSpinnerLoading] = useState(false);

    // category state
    const [categoryOptions, setCategoryOptions] = useState([]);

    // Country state
    const [countryOptions, setCountryOptions] = useState([]);

    // tags state
    const [tags, setTags] = useState([]);

    const [state, dispatch] = useReducer(filtersReducer, initialState);

    const [debouncedPlaceName] = useDebounce(state.placeName, 300);
    const [debouncedCountrySearch] = useDebounce(state.countrySearch, 300);

    const skipNextSearchRef = useRef(false);

    const fetchPlaces = async () => {

        setSpinnerLoading(true);

        try {

            const params = new URLSearchParams({
                context: state.searchContext,
                name: debouncedPlaceName,
                page: state.currentPage,
                status: state.filter,
            });

            if (state.selectedCategoryPath?.length === 2) {
                params.append('categoryId', state.selectedCategoryPath[0]);
                params.append('subcategoryId', state.selectedCategoryPath[1]);
            } else if (state.selectedCategoryPath?.length === 1) {
                params.append('categoryId', state.selectedCategoryPath[0]);
            }

            if (state.selectedCountryId) {
                params.append('countryId', state.selectedCountryId);
            }

            if (state.selectedTagIds.length > 0) {
                state.selectedTagIds.forEach(tagId => params.append('tags', tagId));
            }

            let response = await placesService.searchPlace(params);

            setPagesCount(response.pagination.pagesCount);
            setPlaces(response.places);

            dispatch({ type: 'SET_RECORDS_COUNT', payload: response.pagination.recordsCount });

        } catch (error) {
            fireError(error);
        } finally {
            setSpinnerLoading(false);
        }
    };

    useEffect(() => {

        if (skipNextSearchRef.current) {
            skipNextSearchRef.current = false;
            return;
        }
        fetchPlaces();
    }, [
        state.filter,
        state.currentPage,
        state.selectedCategoryPath,
        state.selectedCountryId,
        state.selectedTagIds,
        debouncedPlaceName
    ]);

    useEffect(() => {

        setSpinnerLoading(true);

    }, [state.placeName]);

    useEffect(() => {

        categoriesService
            .getCategoriesOptions()
            .then(res => {
                const options = mapCategoriesOptions(res);
                setCategoryOptions(options);
            }).catch(err => fireError(err));

        vibesService
            .getVibes()
            .then(res => setTags(mapTagsOptions(res)))
            .catch(err => fireError(err));

    }, []);

    const handlePageChange = (page) => {
        dispatch({ type: 'SET_PAGE', payload: page });
    };

    const handleFilterChange = (e) => {
        dispatch({ type: 'SET_FILTER', payload: e.target.value });
    };

    useEffect(() => {

        if (!debouncedCountrySearch) {
            setCountryOptions([]);
            return;
        }

        dispatch({ type: 'SET_COUNTRY_LOADING', payload: true });

        countriesService
            .getCountries(debouncedCountrySearch)
            .then(res => {

                const options = mapCountryOptions(res);
                setCountryOptions(options);
            })
            .catch(fireError)
            .finally(() => {
                dispatch({ type: 'SET_COUNTRY_LOADING', payload: false });
            });

    }, [debouncedCountrySearch]);

    return (
        <section>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

                <AdminPlaceSearchCard
                    categoryOptions={categoryOptions}
                    countryOptions={countryOptions}
                    setCountryOptions={setCountryOptions}
                    tags={tags}
                    state={state}
                    dispatch={dispatch}
                    skipNextSearchRef={skipNextSearchRef}
                    handleFilterChange={handleFilterChange}
                    recordsCount={state.recordsCount}
                />

            </div>

            <div
                style={{ padding: '0 10rem', paddingBottom: '2.5rem' }}
                className={styles.placesContainer}
            >
                <PlacesList
                    currentPage={state.currentPage}
                    handlePageChange={handlePageChange}
                    isForAdmin={true}
                    pagesCount={pagesCount}
                    places={places}
                    spinnerLoading={spinnerLoading}
                />


                {pagesCount > 1 && !spinnerLoading && (

                    <div style={{ marginBottom: '2rem' }}>

                        <Pagination
                            currentPage={state.currentPage}
                            handlePageChange={handlePageChange}
                            pagesCount={pagesCount}
                            isForAdmin={true}
                        />
                    </div>

                )}
            </div>

        </section>
    );
};

export default AdminPlaces;