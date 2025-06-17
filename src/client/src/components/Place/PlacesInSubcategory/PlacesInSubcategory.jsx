import { useLocation } from "react-router-dom";
import { useState, useEffect, useLayoutEffect } from "react";

import { Spin, ConfigProvider, Typography } from "antd";

import PlacesList from "../PlacesList/PlacesList";

import { fireError } from "../../../utils/fireError";
import { placesServiceFactory } from "../../../services/placesService";

import { useContext } from "react";

import { AuthContext } from "../../../contexts/AuthContext";

import Pagination from "../../Pagination/Pagination";

import { AppstoreOutlined } from "@ant-design/icons";

const PlacesInSubcategory = () => {

    const location = useLocation();

    const subcategoryName = location?.state.subcategoryName;

    const { token } = useContext(AuthContext);

    const placeService = placesServiceFactory(token);

    const [places, setPlaces] = useState([]);

    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [shouldScroll, setShouldScroll] = useState(false);
    const [recordsCount, setRecordsCount] = useState(null);

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

                    setPlaces(res.places);
                    setPagesCount(res.pagination.pagesCount);
                    setSpinnerLoading(false);
                    setShouldScroll(true);
                    setRecordsCount(res.pagination.recordsCount);

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
                    padding: '0 12rem'
                }}>

                    <Typography.Title
                        level={3}
                        style={{
                            textAlign: 'center',
                            marginBottom: '1rem',
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                            fontWeight: 700,
                            fontSize: '2.2rem',
                            letterSpacing: '0.4px',
                            color: '#1A7F64',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.6rem',
                            // marginLeft: '2rem',
                            width: '100%',
                            marginTop: '30px'
                        }}
                    >
                        <span
                            style={{
                                backgroundColor: '#ffffff',
                                borderRadius: '50%',
                                padding: '0.5rem',
                                boxShadow: '0 3px 8px rgba(0, 0, 0, 0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <AppstoreOutlined style={{ color: '#1A7F64', fontSize: '2rem' }} />
                        </span>
                        {subcategoryName} ({recordsCount})
                    </Typography.Title>

                    <PlacesList
                        places={places}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                        isForAdmin={false}
                        pagesCount={pagesCount}
                        spinnerLoading={spinnerLoading}
                    />

                    {pagesCount > 1 && !spinnerLoading && (

                        <div style={{ marginBottom: '2rem' }}>

                            <Pagination
                                currentPage={currentPage}
                                handlePageChange={handlePageChange}
                                pagesCount={pagesCount}
                                isForAdmin={false}
                            />
                        </div>

                    )}
                </div>
            }
        </>
    );
};

export default PlacesInSubcategory;