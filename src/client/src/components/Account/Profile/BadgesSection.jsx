import styles from './BadgesSection.module.css';
import { LockFilled, TrophyFilled } from '@ant-design/icons';
import { Typography, Progress, Card, Spin } from 'antd';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { badgesServiceFactory } from '../../../services/badgeService';

const BadgesSection = ({ isOwnProfile = true }) => {

    const { token } = useContext(AuthContext);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const badgesService = badgesServiceFactory(token);

    useEffect(() => {
        badgesService.getUserBadges()
            .then(res => setBadges(res))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className={styles.badgesSection}>

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
                Achievements
            </Typography.Title>

            {loading ? (
                <Spin size="large" />
            ) : (
                <div className={styles.badgeList}>
                    {badges.map((badge) => (

                        <Card key={badge.id} className={styles.badgeCard}>

                            <div className={styles.badgeContent}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={badge.imageUrl}
                                        alt={badge.name}
                                        className={`${styles.badgeImage} ${!badge.isUnlocked ? styles.locked : ''}`}
                                    />
                                    {!badge.isUnlocked && (
                                        <div className={styles.lockOverlay}>
                                            <LockFilled className={styles.lockIcon} />
                                        </div>
                                    )}
                                </div>

                                <div className={styles.textContent}>
                                    <Typography.Title style={{ fontSize: '3rem', margin: '0', fontFamily: "'Poppins', 'Segoe UI', sans-serif", }} level={5}>{badge.name}</Typography.Title>
                                    {isOwnProfile && <Typography.Text style={{ fontSize: '1.1rem', fontFamily: "'Poppins', 'Segoe UI', sans-serif", }}>{badge.description}</Typography.Text>}

                                    <div className={styles.progressWrapper}>
                                        <Progress
                                            percent={badge.progressPercentage}
                                            status="active"
                                            showInfo
                                            size="default"
                                            strokeColor={
                                                badge.progressPercentage === 100 ? '#52c41a' : '#1890ff'
                                            }
                                        />
                                    </div>

                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BadgesSection;
