import { vibesServiceFactory } from '../../../services/vibesService';
import { placesServiceFactory } from '../../../services/placesService';
import { countriesServiceFactory } from '../../../services/countriesService';
import { categoriesServiceFactory } from '../../../services/categoriesService';

import { useState, useEffect, useContext, useReducer } from "react";

import { useDebounce } from 'use-debounce';
import { ConfigProvider, Card, Typography, Radio } from "antd";

import PlacesList from '../PlacesList/PlacesList';
import PlaceSearchCard from '../PlaceSearchCard/PlaceSearchCard';

import { fireError } from "../../../utils/fireError";
import { AuthContext } from '../../../contexts/AuthContext';

import {
    mapCategoriesOptions,
    mapCountryOptions,
    mapTagsOptions,
} from '../UploadPlace/uploadPlaceUtil';

const options = [
    { label: 'Approved', value: 'Approved' },
    { label: 'Unapproved', value: 'Unapproved' },
    { label: 'Recently Deleted', value: 'Deleted' },
];

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
    searchContext: 'global',
};

function filtersReducer(state, action) {
    switch (action.type) {
        case 'SET_PLACE_NAME':
            return { ...state, placeName: action.payload, currentPage: 1 };
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

const PlacesWithSearchPage = ({ searchContext = 'global', isForAdmin = false }) => {

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

    const [state, dispatch] = useReducer(
        filtersReducer,
        { ...initialState, searchContext }
    );


    const [debouncedPlaceName] = useDebounce(state.placeName, 500);
    const [debouncedCountrySearch] = useDebounce(state.countrySearch, 500);


    const fetchPlaces = async () => {

        setSpinnerLoading(true);

        try {

            const params = new URLSearchParams({
                context: searchContext,
                name: debouncedPlaceName,
                page: state.currentPage,
                status: state.filter
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

        } catch (error) {
            fireError(error);
        } finally {
            setSpinnerLoading(false);
        }
    };


    useEffect(() => {
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
        <>

            {searchContext === 'global' && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <PlaceSearchCard
                        categoryOptions={categoryOptions}
                        countryOptions={countryOptions}
                        setCountryOptions={setCountryOptions}
                        tags={tags}
                        state={state}
                        dispatch={dispatch}
                        isForAdmin={isForAdmin}
                    />
                </div>
            )}

            {searchContext !== 'global' && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    <>
                        <Card
                            style={{
                                width: '60%',
                                padding: '1rem 2rem',
                                backgroundColor: isForAdmin ? '#e6f4ff' : '#f3e9fe',
                                border: `1px solid ${isForAdmin ? '#1890ff' : '#9c4dcc'}`,
                                borderRadius: '16px',
                                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                                textAlign: 'center',
                                marginTop: '2rem'
                            }}
                        >
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Radio: {
                                            colorPrimary: isForAdmin ? '#1890ff' : '#9c4dcc',
                                            buttonBg: isForAdmin ? '#cce4ff' : '#e6d4f5',
                                            buttonColor: isForAdmin ? '#0958d9' : '#6a2c91',
                                            buttonSolidCheckedBg: isForAdmin ? '#1890ff' : '#9c4dcc',
                                            buttonSolidCheckedColor: 'white',
                                            buttonSolidCheckedHoverBg: isForAdmin ? '#1677ff' : '#8a3dac',
                                            buttonSolidCheckedActiveBg: isForAdmin ? '#1890ff' : '#9c4dcc',
                                            borderRadius: 12,
                                        },
                                    },
                                }}
                            >
                                <Typography.Paragraph style={{ fontSize: '1.1rem' }} italic={true}>
                                    Filter
                                </Typography.Paragraph>

                                <Radio.Group
                                    options={options}
                                    defaultValue={state.filter}
                                    optionType="button"
                                    value={state.filter}
                                    buttonStyle="solid"
                                    size="large"
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '1rem',
                                        flexWrap: 'wrap',
                                    }}
                                    onChange={handleFilterChange}
                                    name='Sort'
                                />
                            </ConfigProvider>

                            <PlaceSearchCard
                                categoryOptions={categoryOptions}
                                countryOptions={countryOptions}
                                setCountryOptions={setCountryOptions}
                                tags={tags}
                                state={state}
                                dispatch={dispatch}
                                isForAdmin={isForAdmin}
                            />

                        </Card>
                    </>
                </div>
            )}

            <PlacesList
                currentPage={state.currentPage}
                handlePageChange={handlePageChange}
                isForAdmin={isForAdmin}
                pagesCount={pagesCount}
                places={places}
                spinnerLoading={spinnerLoading}
            />
        </>
    );
};

export default PlacesWithSearchPage;