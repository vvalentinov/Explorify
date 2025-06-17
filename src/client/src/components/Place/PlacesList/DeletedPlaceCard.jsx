import styles from './PlacesList.module.css';

import { Card } from "antd";

import { placesServiceFactory } from '../../../services/placesService';

import { useContext, } from 'react';

import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../contexts/AuthContext';

import { Button } from 'antd';

const DeletedPlaceCard = ({ place, isForAdmin }) => {

    const { token } = useContext(AuthContext);

    const navigate = useNavigate();

    const placesService = placesServiceFactory(token);

    const handleRevert = (placeId) => {
        placesService
            .revertPlace(placeId)
            .then(res => {
                navigate(isForAdmin ? '/admin' : '/', { state: { successOperation: { message: res.successMessage } } })
            }).catch(err => {
                fireError(err);
            })
    };

    return (
        <Card
            className={styles.card}
            cover={
                <img
                    alt={place.name}
                    src={place.imageUrl}
                    style={{
                        height: '200px',
                        objectFit: 'cover',
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px',
                    }}
                />
            }
            style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease',
                border: 'none',
            }}
            styles={{
                body: {
                    textAlign: 'center',
                    padding: '1rem',
                },
            }}
        >
            <Card.Meta title={<span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{place.name}</span>} />
            <Button
                block
                variant='solid'
                color='green'
                danger
                style={{ fontSize: '1.5rem' }}
                onClick={() => handleRevert(place.id)}
            >
                Revert
            </Button>
        </Card>
    );
};

export default DeletedPlaceCard;