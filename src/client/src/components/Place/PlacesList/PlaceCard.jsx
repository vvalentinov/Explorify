import styles from './PlacesList.module.css';

import { Card } from "antd";

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
                cover={
                    <img
                        alt={place.name}
                        src={place.imageUrl}
                        style={{
                            height: '200px',
                            objectFit: 'cover',
                            borderTopLeftRadius: '8px',
                            borderTopRightRadius: '8px',
                        }}
                    />
                }
                style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease',
                    border: 'none',
                }}
                styles={{
                    body: {
                        backgroundColor: isForAdmin ? '#89ADFF' : '#eafffb',
                        textAlign: 'center',
                        padding: '1rem',
                    },
                }}
            >
                <Card.Meta title={place.name} style={{ fontSize: '16px' }} />
            </Card>
        </Link>
    );
};

export default PlaceCard;