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
                    backgroundColor: '#fff1f0',
                    textAlign: 'center',
                    padding: '1rem',
                },
            }}
        >
            <Card.Meta title={place.name} style={{ fontSize: '16px' }} />
            <Button
                block
                type="primary"
                danger
                style={{ marginTop: '1rem' }}
                onClick={() => handleRevert(place.id)}
            >
                Revert
            </Button>
        </Card>
    );
};

export default DeletedPlaceCard;