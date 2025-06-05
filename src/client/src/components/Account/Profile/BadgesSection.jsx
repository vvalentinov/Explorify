import styles from './BadgesSection.module.css';

import {
    LockFilled
} from '@ant-design/icons';

const urls = [
    'https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/explorifyElite.png',
    'https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/reviewRookie.png',
    'https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/firstFollower.png',
    'https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/influencer.png',
    'https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/localLegend.png',
    'https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/miniCommunity.png',
    'https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/placePioneer.png',
    'https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/risingStar.png'
];

const badges = [
    { id: 1, name: 'Explorify Elite', imageUrl: urls[0], isUnlocked: true },
    { id: 2, name: 'First Follower', imageUrl: urls[1], isUnlocked: true },
    { id: 3, name: 'Influencer', imageUrl: urls[2], isUnlocked: false },
    { id: 4, name: 'Local Legend', imageUrl: urls[3], isUnlocked: false },
    { id: 5, name: 'Mini Community', imageUrl: urls[4], isUnlocked: false },
    { id: 6, name: 'Place Pioneer', imageUrl: urls[5], isUnlocked: true },
    { id: 7, name: 'Review Rookie', imageUrl: urls[6], isUnlocked: true },
    { id: 8, name: 'Rising Star', imageUrl: urls[7], isUnlocked: false },
];

import { Typography } from 'antd';

const BadgesSection = () => {
    return (
        <div className={styles.badgesSection}>
            <Typography.Title level={3} className={styles.sectionTitle}>
                <span style={{ fontSize: '5rem' }}>🏆</span>
                <span>Achievements</span>

            </Typography.Title>

            <div className={styles.badgesContainer}>
                {badges.map((badge) => (
                    <div
                        key={badge.id}
                        className={styles.badgeWrapper}
                    >
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
                ))}
            </div>

        </div>
    );
};

export default BadgesSection;