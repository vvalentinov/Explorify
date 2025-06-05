import styles from './Home.module.css';

import { motion } from 'framer-motion';

import { homeServiceFactory } from '../../services/homeService';
import { useState, useEffect } from 'react';

import { fireError } from '../../utils/fireError';

import { Typography } from 'antd';

const { Text, Title, Paragraph } = Typography;

const AnimatedEmoji = () => (
    <motion.span
        style={{ display: 'inline-block', cursor: 'pointer' }}
        whileHover={{
            scale: 1.2,
            rotate: 10,
            transition: { type: 'spring', stiffness: 200, damping: 12 }
        }}
        whileTap={{
            scale: [1, 0.8, 1],
            rotate: 0,
            transition: { duration: 0.3, ease: 'easeInOut' }
        }}
        aria-label="Globe emoji"
        role="img"
    >
        🌍
    </motion.span>
);

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
                        Discover Cool Places <AnimatedEmoji />
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
                        paddingTop: '2rem'
                    }}
                    className={styles.placesContainer}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                            }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            style={{
                                background: 'linear-gradient(135deg, #b7eb8f, #87e8de)', // pastel green-teal
                                color: '#004d40',
                                borderRadius: '16px',
                                padding: '0.75rem 2rem',
                                display: 'inline-block',
                                fontWeight: '600',
                                fontSize: '1.4rem',
                                letterSpacing: '0.5px',
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                            }}
                        >
                            🌍 Recent Places
                        </motion.div>
                    </div>

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

                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                            }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            style={{
                                background: 'linear-gradient(135deg, #b7eb8f, #87e8de)',
                                color: '#004d40',
                                borderRadius: '16px',
                                padding: '0.75rem 2rem',
                                display: 'inline-block',
                                fontWeight: '600',
                                fontSize: '1.4rem',
                                letterSpacing: '0.5px',
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                            }}
                        >
                            ⭐ Highest Rated Places
                        </motion.div>
                    </div>

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