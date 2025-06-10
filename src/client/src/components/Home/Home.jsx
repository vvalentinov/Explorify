import styles from './Home.module.css';

import { motion } from 'framer-motion';

import { homeServiceFactory } from '../../services/homeService';
import { useState, useEffect } from 'react';

import { fireError } from '../../utils/fireError';

import { Typography } from 'antd';

const { Title } = Typography;

import { GlobalOutlined, StarFilled } from '@ant-design/icons';

import PlacesList from '../Place/PlacesList/PlacesList';

const Home = () => {

    const homeService = homeServiceFactory();

    const [recentPlaces, setRecentPlaces] = useState([]);
    const [highestRatedPlaces, setHighestRatedPlaces] = useState([]);

    useEffect(() => {
        homeService
            .getHomeData()
            .then(res => {
                setRecentPlaces(res.recentPlaces);
                setHighestRatedPlaces(res.highestRatedPlaces);
            }).catch(err => {
                fireError(err);
            })

    }, []);

    return (
        <>
            <section className={styles.heroSection}>

                <div className={styles.heroBackground} />

                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 80, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 90,
                        damping: 12,
                        duration: 0.9,
                        delay: 0.1
                    }}
                >
                    <Title level={1} className={styles.heroTitle}>
                        Discover Cool Places  🌍
                    </Title>
                    <Typography.Paragraph className={styles.heroDescription}>
                        Ready to embark on unforgettable adventures? Explorify helps you discover breathtaking places, share your own experiences, and connect with fellow travelers around the world. Whether you're chasing hidden waterfalls, wandering through ancient cities, or savoring local flavors off the beaten path, Explorify is your trusted companion.
                    </Typography.Paragraph>
                </motion.div>

            </section>

            <section style={{ padding: '2rem' }}>
                <div
                    style={{
                        marginBottom: '1.5rem',
                        padding: '0 8rem',
                        paddingTop: '2rem',
                    }}
                >

                    <Typography.Title
                        level={3}
                        style={{
                            textAlign: 'left',
                            marginBottom: '2.5rem',
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                            fontWeight: 700,
                            fontSize: '2.2rem',
                            letterSpacing: '0.4px',
                            color: '#1A7F64',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: '0.6rem',
                            marginLeft: '2rem',
                            width: '100%'
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
                            <GlobalOutlined style={{ color: '#1A7F64', fontSize: '2rem' }} />
                        </span>
                        Recent Places
                    </Typography.Title>

                    <PlacesList
                        places={recentPlaces}
                        currentPage={1}
                        isForAdmin={false}
                        pagesCount={1}
                        spinnerLoading={false}
                    />

                </div>

                <div
                    style={{
                        marginBottom: '1.5rem',
                        padding: '0 8rem',
                        marginTop: '4rem'
                    }}
                    className={styles.placesContainer}
                >

                    <Typography.Title
                        level={3}
                        style={{
                            textAlign: 'left',
                            marginBottom: '2.5rem',
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                            fontWeight: 700,
                            fontSize: '2.2rem',
                            letterSpacing: '0.4px',
                            color: '#1A7F64',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: '0.6rem',
                            marginLeft: '2rem',
                            width: '100%'
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
                            <StarFilled style={{ color: '#1A7F64', fontSize: '2rem' }} />
                        </span>
                        Highest Rated Places
                    </Typography.Title>

                    <PlacesList
                        places={highestRatedPlaces}
                        currentPage={1}
                        isForAdmin={false}
                        pagesCount={1}
                        spinnerLoading={false}
                    />
                </div>
            </section>

        </>

    );
};

export default Home;