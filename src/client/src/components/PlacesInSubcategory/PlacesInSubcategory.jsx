import { useLocation } from "react-router-dom";
import { useState, useEffect, useLayoutEffect } from "react";

import { Pagination, Spin, ConfigProvider } from "antd";

import PlacesList from '../PlacesList/PlacesList';

import { fireError } from "../../utils/fireError";
import { placesServiceFactory } from "../../services/placesService";

const PlacesInSubcategory = () => {

    const location = useLocation();

    const placeService = placesServiceFactory();

    const [places, setPlaces] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [shouldScroll, setShouldScroll] = useState(false);
    const [pagesCount, setPagesCount] = useState(0);

    useLayoutEffect(() => {
        if (shouldScroll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShouldScroll(false);
        }
    }, [shouldScroll]);

    useEffect(() => {

        if (location.state?.subcategoryId) {

            setSpinnerLoading(true);

            const MIN_SPINNER_TIME = 1000;
            const startTime = Date.now();

            placeService
                .getPlacesInSubcategory(location.state.subcategoryId, currentPage)
                .then(res => {

                    const elapsed = Date.now() - startTime;
                    const remaining = MIN_SPINNER_TIME - elapsed;

                    setTimeout(() => {
                        setPagesCount(res.pagination.pagesCount);
                        setSpinnerLoading(false);
                        setShouldScroll(true);
                    }, remaining > 0 ? remaining : 0);

                    setPlaces(res.places);
                }).catch(err => {
                    fireError(err);
                    setSpinnerLoading(false);
                });
        }

    }, []);

    const handlePageChange = (page) => {
        setShouldScroll(true);

        setCurrentPage(page);
        setSpinnerLoading(true);

        const MIN_SPINNER_TIME = 1000;
        const startTime = Date.now();

        placeService
            .getPlacesInSubcategory(location.state.subcategoryId, page)
            .then(res => {

                const elapsed = Date.now() - startTime;
                const remaining = MIN_SPINNER_TIME - elapsed;

                setTimeout(() => {
                    setPlaces(res.places);
                    setPagesCount(res.pagination.pagesCount);
                    setSpinnerLoading(false);

                }, remaining > 0 ? remaining : 0);

            }).catch(err => {
                fireError(err);
                setSpinnerLoading(false);
            });
    };

    return (
        <>
            {spinnerLoading ?
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 'calc(100vh - 63px)'
                }}>
                    <ConfigProvider theme={{
                        components: {
                            Spin: {
                                colorPrimary: 'green'
                            }
                        }
                    }}>
                        <Spin size='large' spinning={spinnerLoading} />
                    </ConfigProvider>
                </div> :
                <>
                    <PlacesList places={places} />

                    <Pagination
                        align='center'
                        onChange={handlePageChange}
                        current={currentPage}
                        total={pagesCount * 6}
                        pageSize={6}
                        style={{ textAlign: 'center', marginBottom: '1rem' }}
                    />
                </>
            }
        </>
    );
};

export default PlacesInSubcategory;