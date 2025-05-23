import { Card } from 'antd';

import { Link } from 'react-router-dom';

import styles from './PlacesList.module.css';

import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const PlacesList = ({ places, isForAdmin }) => {

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
                        cursor: 'pointer',
                        textDecoration: 'none',
                    }}
                // whileHover={{ scale: 1.03 }}
                >
                    <Link
                        to={isForAdmin ? `/admin/place/${place.slugifiedName}` : `/place/${place.slugifiedName}`}
                        state={{ placeId: place.id }}
                        style={{ textDecoration: 'none' }}
                    >
                        <Card className={styles.card}
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
                                border: 'none'
                            }}
                            styles={{
                                body: {
                                    backgroundColor: isForAdmin ? '#89ADFF' : '#eafffb',
                                    textAlign: 'center',
                                    padding: '1rem',
                                }
                            }}
                        >
                            <Card.Meta title={place.name} style={{ fontSize: '16px' }} />
                        </Card>
                    </Link>
                </motion.div>
            ))}
        </motion.section>
    );
};

export default PlacesList;