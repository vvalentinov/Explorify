import styles from './PlacesList.module.css';
import { Card } from 'antd';
import { Link } from 'react-router-dom';

const PlaceCard = ({ place, isForAdmin }) => {

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
                        display: 'none'
                    }
                }}
                cover={
                    <div className={styles.imageWrapper}>
                        <img
                            alt={place.name}
                            src={place.imageUrl}
                            className={styles.placeImage}
                        />
                        <div className={styles.placeTitle}>{place.name}</div>
                    </div>
                }
            />
        </Link>
    );
};

export default PlaceCard;
