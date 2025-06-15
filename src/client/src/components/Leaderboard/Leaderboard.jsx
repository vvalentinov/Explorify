import styles from './Leaderboard.module.css';

import { useState, useEffect, useLayoutEffect } from 'react';

import { TrophyFilled, UserOutlined } from '@ant-design/icons';
import { List, Avatar, Card, Typography, Input } from 'antd';

import { motion } from 'framer-motion';

import { leaderboardServiceFactory } from '../../services/leaderboardService';

import { fireError } from '../../utils/fireError';

import Pagination from '../Pagination/Pagination';

import { useDebounce } from 'use-debounce';

import { useNavigate } from 'react-router-dom';

const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
};

const medalAnimation = {
    animate: {
        rotate: [0, -10, 10, -6, 6, -3, 3, 0],
        scale: [1, 1.1, 1, 1.1, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 5,
            ease: 'easeInOut',
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.12,
            duration: 0.4,
            ease: 'easeOut',
        },
    }),
};

const Leaderboard = () => {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(1);

    const [userName, setUserName] = useState('');

    const [debouncedUserName] = useDebounce(userName, 300);

    const leaderboardService = leaderboardServiceFactory();

    const [shouldScroll, setShouldScroll] = useState(false);

    useLayoutEffect(() => {
        if (shouldScroll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShouldScroll(false);
        }
    }, [shouldScroll]);

    useEffect(() => {
        if (debouncedUserName.trim() === '') {
            // If search input is empty, fall back to regular leaderboard
            leaderboardService
                .getInfo(currentPage)
                .then(res => {
                    setUsers(res.users);
                    setPagesCount(res.pagination.pagesCount);
                })
                .catch(err => fireError(err));
        } else {
            leaderboardService
                .search(debouncedUserName, currentPage)
                .then(res => {
                    setUsers(res.users);
                    setPagesCount(res.pagination.pagesCount);
                })
                .catch(err => fireError(err));
        }
    }, [debouncedUserName, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedUserName]);

    const isSearching = debouncedUserName.trim() !== '';

    return (
        <section className={styles.leaderboardSection}>

            <div className={styles.container}>

                <Typography.Title
                    level={3}
                    style={{
                        textAlign: 'left',
                        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                        fontWeight: 700,
                        fontSize: '2.2rem',
                        letterSpacing: '0.4px',
                        color: '#1A7F64',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.6rem',
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
                        <TrophyFilled style={{ color: '#1A7F64', fontSize: '2rem' }} />
                    </span>
                    Leaderboard
                </Typography.Title>

                <Input
                    placeholder='Search for user...'
                    style={{
                        fontSize: '2rem',
                        marginBottom: '2rem',
                        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    }}
                    styles={{
                        input: {
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                        }
                    }}
                    onChange={(e) => setUserName(e.target.value)}
                    allowClear
                />

                <List
                    itemLayout="horizontal"
                    dataSource={users}
                    className={styles.usersList}
                    locale={{
                        emptyText: (
                            <div style={{
                                fontSize: '1.6rem',
                                textAlign: 'center',
                                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                                color: '#999',
                                padding: '3rem 0',
                            }}>
                                🚫 No users found
                            </div>
                        )
                    }}
                    renderItem={(user, index) => (

                        <motion.div
                            className={styles.cardWrapper}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            custom={index}
                        >

                            <div className={styles.rankBadge}>
                                #{user.rank}
                            </div>

                            {!isSearching && user.rank <= 3 && (
                                <motion.div
                                    className={styles.medalEmoji}
                                    variants={medalAnimation}
                                    animate="animate"
                                >
                                    {getMedalEmoji(user.rank)}
                                </motion.div>
                            )}

                            <Card
                                className={`${styles.card} ${!isSearching && user.rank === 1
                                    ? styles.goldCard
                                    : !isSearching && user.rank === 2
                                        ? styles.silverCard
                                        : !isSearching && user.rank === 3
                                            ? styles.bronzeCard
                                            : ''
                                    }`}
                                hoverable
                                onClick={() => navigate(`/profile/${user.userName}`, { state: { userId: user.id } })}
                            >
                                <List.Item>
                                    <div className={styles.userCardContent}>
                                        <div className={styles.avatarSection}>
                                            <Avatar
                                                size={150}
                                                {...(user.profileImageUrl
                                                    ? { src: user.profileImageUrl }
                                                    : { icon: <UserOutlined /> })}
                                            />

                                            <Typography.Text className={styles.username}>
                                                {user.userName}
                                            </Typography.Text>
                                        </div>
                                        <div className={styles.infoSection}>
                                            <Typography.Text className={styles.userBio}>
                                                {user.bio || "No bio yet — just vibing through adventures! 🌍✨"}
                                            </Typography.Text>
                                            <div className={styles.userStats}>
                                                <div className={styles.statBadge}>
                                                    <span className={styles.statValue}>{user.points}</span>
                                                    <span className={styles.statLabel}>points</span>
                                                </div>
                                                <div className={styles.statBadge}>
                                                    <span className={styles.statValue}>{user.placesCount}</span>
                                                    <span className={styles.statLabel}>places</span>
                                                </div>
                                                <div className={styles.statBadge}>
                                                    <span className={styles.statValue}>{user.reviewsCount}</span>
                                                    <span className={styles.statLabel}>reviews</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </List.Item>
                            </Card>
                        </motion.div>



                    )}
                />

                {pagesCount > 1 && (
                    <div className={styles.paginationWrapper}>
                        <Pagination
                            currentPage={currentPage}
                            handlePageChange={(page) => {
                                setCurrentPage(page);
                                setShouldScroll(true);
                            }}
                            isForAdmin={false}
                            pagesCount={pagesCount}
                        />
                    </div>

                )}

            </div>
        </section>

    );

};

export default Leaderboard;