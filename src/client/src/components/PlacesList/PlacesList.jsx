import { Card, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import styles from './PlacesList.module.css';

import { AuthContext } from '../../contexts/AuthContext';

import { useContext, } from 'react';

import { placesServiceFactory } from '../../services/placesService';
import { adminServiceFactory } from '../../services/adminService';

import { fireError } from '../../utils/fireError';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const PlacesList = ({ places, isForAdmin }) => {

    const { token } = useContext(AuthContext);

    const navigate = useNavigate();

    const placesService = placesServiceFactory(token);
    const adminService = adminServiceFactory(token);

    const handleRevert = (placeId) => {

        if (isForAdmin) {
            adminService
                .revertPlace(placeId)
                .then(res => {
                    navigate('/admin', { state: { successOperation: { message: res.successMessage } } })
                }).catch(err => {
                    fireError(err);
                })
        } else {
            placesService
                .revertPlace(placeId)
                .then(res => {
                    navigate('/', { state: { successOperation: { message: res.successMessage } } })
                }).catch(err => {
                    fireError(err);
                })
        }

    };

    return (
        <motion.section
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1.5rem',
                padding: '2rem',
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {places.map((place) => (
                <motion.div
                    key={place.id}
                    variants={itemVariants}
                    style={{
                        width: 'calc(33.33% - 1rem)',
                        cursor: place.isDeleted ? 'default' : 'pointer',
                        textDecoration: 'none',
                    }}
                >
                    {place.isDeleted ? (
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
                            <Button block
                                type="primary"
                                danger
                                style={{ marginTop: '1rem' }}
                                onClick={() => handleRevert(place.id)}
                            >
                                Revert
                            </Button>
                        </Card>
                    ) : (
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
                    )}
                </motion.div>
            ))}
        </motion.section>
    );
};

export default PlacesList;
