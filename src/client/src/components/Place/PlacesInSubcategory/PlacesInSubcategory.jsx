import { useLocation } from "react-router-dom";
import { useState, useEffect, useLayoutEffect } from "react";

import { Pagination, Spin, ConfigProvider } from "antd";

import PlacesList from "../PlacesList/PlacesList";

import { fireError } from "../../../utils/fireError";
import { placesServiceFactory } from "../../../services/placesService";

const PlacesInSubcategory = () => {

    const location = useLocation();

    const placeService = placesServiceFactory();

    const [places, setPlaces] = useState([]);

    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [shouldScroll, setShouldScroll] = useState(false);

    useLayoutEffect(() => {
        if (shouldScroll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShouldScroll(false);
        }
    }, [shouldScroll]);

    useEffect(() => {

        if (location.state?.subcategoryId) {

            setSpinnerLoading(true);

            placeService
                .getPlacesInSubcategory(location.state.subcategoryId, currentPage)
                .then(res => {

                    setPagesCount(res.pagination.pagesCount);
                    setPlaces(res.places);
                    setSpinnerLoading(false);
                    setShouldScroll(true);

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

        placeService
            .getPlacesInSubcategory(location.state.subcategoryId, page)
            .then(res => {
                setPlaces(res.places);
                setPagesCount(res.pagination.pagesCount);
                setSpinnerLoading(false);
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

                    {pagesCount > 1 &&
                        <ConfigProvider theme={{
                            components: {
                                Pagination: {
                                    itemActiveBg: '#e8fffb',
                                    itemActiveColor: '#52c41a',
                                    colorPrimary: '#52c41a',
                                    colorPrimaryHover: '#389e0d',
                                },
                            }
                        }}><Pagination
                                align='center'
                                onChange={handlePageChange}
                                current={currentPage}
                                total={pagesCount * 6}
                                pageSize={6}
                                style={{ textAlign: 'center', marginBottom: '1rem' }}
                            />
                        </ConfigProvider>
                    }

                </>
            }
        </>
    );
};

export default PlacesInSubcategory;