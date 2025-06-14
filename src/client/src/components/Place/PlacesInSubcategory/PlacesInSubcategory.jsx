import { useLocation } from "react-router-dom";
import { useState, useEffect, useLayoutEffect } from "react";

import { Pagination, Spin, ConfigProvider } from "antd";

import PlacesList from "../PlacesList/PlacesList";

import { fireError } from "../../../utils/fireError";
import { placesServiceFactory } from "../../../services/placesService";

import { useContext } from "react";

import { AuthContext } from "../../../contexts/AuthContext";

const PlacesInSubcategory = () => {

    const location = useLocation();

    const { token } = useContext(AuthContext);

    const placeService = placesServiceFactory(token);

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
                    minHeight: 'calc(100vh - 100px)'
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
                <div style={{
                    minHeight: 'calc(100vh - 100px)',
                    paddingTop: '4rem',
                    paddingLeft: '8rem',
                    paddingRight: '8rem'
                }}>
                    <PlacesList
                        places={places}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                        isForAdmin={false}
                        pagesCount={pagesCount}
                        spinnerLoading={spinnerLoading}
                    />
                </div>
            }
        </>
    );
};

export default PlacesInSubcategory;