import styles from './MyPlaces.module.css';

import { usersServiceFactory } from "../../services/usersService";
import { placesServiceFactory } from '../../services/placesService';

import { useState, useEffect, useContext, useLayoutEffect } from "react";

import { AuthContext } from '../../contexts/AuthContext';

import { fireError } from "../../utils/fireError";

import { motion } from 'framer-motion';

import { Pagination, Spin, ConfigProvider, Card, Button } from "antd";

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const MyPlaces = () => {

    const { token } = useContext(AuthContext);

    const navigate = useNavigate();

    const userService = usersServiceFactory(token);
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

        setSpinnerLoading(true);

        const MIN_SPINNER_TIME = 1000;
        const startTime = Date.now();

        userService
            .getUserPlaces(currentPage)
            .then(res => {

                const elapsed = Date.now() - startTime;
                const remaining = MIN_SPINNER_TIME - elapsed;

                setTimeout(() => {
                    setPagesCount(res.pagination.pagesCount);
                    setPlaces(res.places);
                    setSpinnerLoading(false);
                    setShouldScroll(true);
                }, remaining > 0 ? remaining : 0);

            }).catch(err => {
                fireError(err);
                setSpinnerLoading(false);
            });

    }, []);

    const handlePageChange = (page) => {

        setShouldScroll(true);

        setCurrentPage(page);
        setSpinnerLoading(true);

        const MIN_SPINNER_TIME = 1000;
        const startTime = Date.now();

        userService
            .getUserPlaces(page)
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

    const handlePlaceDelete = (placeId) => {

        setSpinnerLoading(true);

        placeService
            .deletePlace(placeId)
            .then(res => {
                handlePageChange(1);
            }).catch(err => {
                fireError(err);
            })
    }

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
                    <motion.section
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '1.5rem',
                            padding: '2rem',
                        }}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {places.map((place) => (
                            <motion.div
                                key={place.id}
                                variants={itemVariants}
                                style={{
                                    width: 'calc(33.33% - 1rem)',
                                    textDecoration: 'none',
                                }}
                            >

                                <Card
                                    hoverable
                                    className={styles.card}
                                    cover={
                                        <img
                                            alt={place.name}
                                            src={place.imageUrl}
                                            style={{
                                                height: '200px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    }
                                    style={{
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        transition: 'transform 0.3s ease',
                                    }}
                                    styles={{
                                        body: {
                                            backgroundColor: '#eafffb',
                                            textAlign: 'center',
                                            padding: '1rem',
                                        }
                                    }}
                                >

                                    <Card.Meta title={place.name} style={{ fontSize: '16px' }} />

                                    <div
                                        style={{
                                            marginTop: '1rem',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: '0.75rem'
                                        }}
                                    >

                                        <Button
                                            style={{ width: '50%' }}
                                            variant='solid'
                                            color='cyan'
                                            onClick={() => console.log(`Edit place ${place.id}`)}
                                        >
                                            <EditOutlined style={{ fontSize: '1.2rem' }} />
                                        </Button>

                                        <Button
                                            style={{ width: '50%', }}
                                            variant='solid'
                                            color='danger'
                                            onClick={() => handlePlaceDelete(place.id)}
                                        >
                                            <DeleteOutlined style={{ fontSize: '1.2rem' }} />

                                        </Button>

                                    </div>

                                    <Button
                                        onClick={() => navigate(`/place/${place.slugifiedName}`, { state: { placeId: place.id } })}
                                        variant='solid'
                                        color='primary'
                                        block
                                        style={{ marginTop: '1rem' }}
                                    >
                                        Go To Place
                                    </Button>

                                </Card>

                            </motion.div>
                        ))}
                    </motion.section>

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
                        }}>
                            <Pagination
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

export default MyPlaces;