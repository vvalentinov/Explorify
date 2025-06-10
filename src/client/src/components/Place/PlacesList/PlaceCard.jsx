import styles from './PlacesList.module.css';
import { Card, message } from 'antd';
import { Link } from 'react-router-dom';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { favPlaceServiceFactory } from '../../../services/favPlaceService';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { fireError } from '../../../utils/fireError';

const PlaceCard = ({ place, isForAdmin }) => {

    const { token, isAuthenticated, userId } = useContext(AuthContext);

    const favPlaceService = favPlaceServiceFactory(token);

    const [isFavorite, setIsFavorite] = useState(place.isFavorite);

    const handleHeartClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (!isFavorite) {
                const res = await favPlaceService.addToFavorites(place?.id);
                setIsFavorite(true);
                message.success(res.successMessage, 5);
            } else {
                const res = await favPlaceService.removeFromFavorites(place?.id);
                setIsFavorite(false);
                message.success(res.successMessage, 5);
            }
        } catch (err) {
            fireError(err);
        }
    };

    const heartIcon = isAuthenticated && place?.userId !== userId && (
        <div className={styles.heartIcon} onClick={handleHeartClick}>
            {isFavorite ? (
                <HeartFilled style={{ color: '#ff4d4f', fontSize: '25px' }} />
            ) : (
                <HeartOutlined style={{ color: '#999', fontSize: '25px' }} />
            )}
        </div>
    );

    return (
        <Link
            to={isForAdmin ? `/admin/place/${place.slugifiedName}` : `/place/${place.slugifiedName}`}
            state={{ placeId: place.id }}
            style={{ textDecoration: 'none' }}
        >
            <Card
                className={styles.card}
                hoverable
                style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                }}
                styles={{
                    body: {
                        display: 'none',
                    },
                }}
                cover={
                    <div className={styles.imageWrapper}>
                        <img
                            alt={place.name}
                            src={place.imageUrl}
                            className={styles.placeImage}
                        />

                        {heartIcon}

                        <div className={styles.placeTitle}>
                            {place.name}

                            <div className={styles.placeRating}>
                                <span className={styles.star}>★</span>
                                <span className={styles.ratingText}>
                                    {place.averageRating?.toFixed(1) ?? 'N/A'}/5
                                </span>
                            </div>
                        </div>
                    </div>
                }
            />
        </Link>
    );
};

export default PlaceCard;

