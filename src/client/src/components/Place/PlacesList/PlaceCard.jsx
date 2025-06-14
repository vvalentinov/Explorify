import styles from './PlaceCard.module.css';

import { message } from 'antd';
import { HeartFilled } from '@ant-design/icons';

import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';

import { fireError } from '../../../utils/fireError';
import { AuthContext } from '../../../contexts/AuthContext';
import { favPlaceServiceFactory } from '../../../services/favPlaceService';

const PlaceCard = ({
    place,
    isForAdmin,
    forceFetchPlaces,
    isForFavPlaces = false
}) => {

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

                if (isForFavPlaces) {
                    forceFetchPlaces();
                }
            }
        } catch (err) {
            fireError(err);
        }
    };

    const heartIcon = isAuthenticated && place?.userId !== userId && (
        <>
            {isFavorite ? (
                <HeartFilled
                    onClick={handleHeartClick}
                    className={styles.heartIcon}
                    style={{ color: '#ff4d4f' }}
                />
            ) : (
                <HeartFilled
                    onClick={handleHeartClick}
                    className={styles.heartIcon}
                    style={{ color: '#fff' }}
                />
            )}
        </>
    );

    return (
        <Link
            to={isForAdmin ? `/admin/place/${place.slugifiedName}` : `/place/${place.slugifiedName}`}
            state={{ placeId: place.id }}
            style={{ textDecoration: 'none' }}
        >
            <div className={`${styles.customCard} ${isForAdmin ? styles.adminCard : styles.publicCard}`}>
                <div className={styles.imageWrapper}>

                    <img alt={place.name} src={place.imageUrl} className={styles.placeImage} />

                    {!isForAdmin && place.userId !== userId && heartIcon}

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
            </div>
        </Link>
    );
};

export default PlaceCard;

