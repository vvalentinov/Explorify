import { motion } from "framer-motion";
import { UsergroupAddOutlined, TrophyFilled, TeamOutlined } from '@ant-design/icons';
import { Card, Avatar, Button, Pagination, Input, List, ConfigProvider, Typography, Radio } from 'antd';
import { useState, useEffect, useContext } from 'react';

import { AuthContext } from "../../contexts/AuthContext";

import { usersServiceFactory } from "../../services/usersService";

import { fireError } from "../../utils/fireError";

import slugify from "slugify";

import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import styles from './MyFollowing.module.css';

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

const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
};

const MyFollowing = () => {

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const usersService = usersServiceFactory(token);

    const [users, setUsers] = useState([]);
    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [sortDirection, setSortDirection] = useState("asc");

    useEffect(() => {

        usersService
            .getFollowing(currentPage, sortDirection)
            .then(res => {
                setUsers(res.users);
                setPagesCount(res.pagination.pagesCount);
            }).catch(err => {
                fireError(err);
            });

    }, [currentPage, sortDirection]);

    const isSearching = false;

    return (
        <section className={styles.leaderboardSection}>

            <div className={styles.container}>

                <Radio.Group
                    value={sortDirection}
                    onChange={(e) => {
                        setSortDirection(e.target.value);
                        setCurrentPage(1);
                    }}
                    className={styles.radioGroup}
                >
                    <Radio.Button value="asc">Rank: Low to High</Radio.Button>
                    <Radio.Button value="desc">Rank: High to Low</Radio.Button>
                </Radio.Group>

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
                        <TeamOutlined style={{ color: '#1A7F64', fontSize: '2rem' }} />
                    </span>
                    My Following Network
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

                                        <Button
                                            shape="round"
                                            size="large"
                                            style={{
                                                backgroundColor: '#1A7F64',
                                                borderColor: '#1A7F64',
                                                color: '#ffffff',
                                                fontWeight: 600,
                                                fontSize: '1.3rem',
                                                padding: '0.4rem 1.8rem',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 10px rgba(26, 127, 100, 0.2)',
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/${slugify(user.userName, { lower: true })}/places`, { state: { userState: user } });
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#166b52';
                                                e.currentTarget.style.borderColor = '#166b52';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#1A7F64';
                                                e.currentTarget.style.borderColor = '#1A7F64';
                                            }}
                                        >
                                            Places
                                        </Button>

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
    )
};

export default MyFollowing;