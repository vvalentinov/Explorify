import styles from './Home.module.css';

import { motion } from 'framer-motion';

import { homeServiceFactory } from '../../services/homeService';
import { useState, useEffect } from 'react';

import { fireError } from '../../utils/fireError';

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

    const pillStyle = {
        fontSize: '1rem',
        padding: '0.4rem 1rem',
        borderRadius: '20px',
        fontWeight: 'bold',
        display: 'inline-block',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '1rem'
    };

    return (
        <>
            <section className={styles.heroSection}>

                <div className={styles.heroBackground} />

                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Discover Cool Places <AnimatedEmoji />
                    </h1>
                    <p className={styles.heroDescription}>
                        Ready to embark on unforgettable adventures? Explorify helps you discover breathtaking places, share your own experiences, and connect with fellow travelers around the world. Whether you're chasing hidden waterfalls, wandering through ancient cities, or savoring local flavors off the beaten path, Explorify is your trusted companion.
                    </p>
                </div>

            </section>

            <section style={{
                padding: '2rem'
            }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>


                        <motion.div
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            style={{
                                background: 'linear-gradient(90deg, #52c41a, #36cfc9)',
                                color: 'white',
                                borderRadius: '20px',
                                padding: '0.5rem 1.2rem',
                                display: 'inline-block',
                                fontWeight: '600',
                                fontSize: '1.5rem',
                                cursor: 'default'
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

                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <motion.div
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            style={{
                                background: 'linear-gradient(90deg, #52c41a, #36cfc9)',
                                color: 'white',
                                borderRadius: '20px',
                                padding: '0.5rem 1.2rem',
                                display: 'inline-block',
                                fontWeight: '600',
                                fontSize: '1.5rem',
                                cursor: 'default'
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