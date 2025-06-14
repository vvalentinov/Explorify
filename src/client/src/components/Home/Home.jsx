import styles from './Home.module.css';

import { motion } from 'framer-motion';

import { homeServiceFactory } from '../../services/homeService';
import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { fireError } from '../../utils/fireError';

import { Typography, Button } from 'antd';

const { Title } = Typography;

import { GlobalOutlined, StarFilled } from '@ant-design/icons';

import PlacesList from '../Place/PlacesList/PlacesList';

import { useContext } from 'react';

import { AuthContext } from '../../contexts/AuthContext';

const Home = () => {

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const homeService = homeServiceFactory(token);

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
                        Ready to embark on unforgettable adventures? Explorify is your gateway to the world’s most breathtaking places — from tucked-away waterfalls deep in the jungle to majestic castles perched on lonely hills. Discover, share, and relive travel experiences through captivating stories, stunning photos, and genuine reviews from fellow explorers like you. Whether you're strolling through ancient cities, hiking across alpine trails, diving into local street food scenes, or seeking hidden gems off the beaten path, Explorify is more than just a travel platform — it's a thriving community of passionate travelers helping each other uncover the world, one journey at a time.
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

            <section className={styles.leaderboardSection}>
                <motion.div
                    className={styles.leaderboardContent}
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 80,
                        damping: 14,
                        duration: 1
                    }}
                    viewport={{ once: true }}
                >
                    <img
                        src="/assets/people.svg"
                        alt="Community Leaderboard"
                        className={styles.leaderboardImage}
                    />

                    <div className={styles.leaderboardContainer}>

                        <Title level={2} className={styles.leaderboardTitle}>
                            🧭 Meet the Explorify Community
                        </Title>

                        <Typography.Paragraph className={styles.leaderboardDescription}>
                            Curious about the incredible people behind Explorify? Our community is made up of passionate explorers from all walks of life — travelers who love discovering hidden gems, sharing unforgettable experiences, and connecting with others through a shared love of adventure. The Explorify Leaderboard is where you can browse everyone who’s been contributing, from first-time posters to seasoned reviewers. It's not just about who has the most points — it’s about celebrating a vibrant, growing network of curious minds. Jump in, get inspired, and find your next favorite explorer to follow!
                        </Typography.Paragraph>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                className={styles.leaderboardBtn}
                                onClick={() => { navigate('/leaderboard') }}
                            >
                                Explore All Users
                            </Button>
                        </div>

                    </div>
                </motion.div>
            </section>



        </>

    );
};

export default Home;