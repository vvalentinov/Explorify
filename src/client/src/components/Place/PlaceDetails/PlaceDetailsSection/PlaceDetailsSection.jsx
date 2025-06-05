import styles from './PlaceDetailsSection.module.css';
import { UserOutlined, FileTextOutlined, HeartOutlined } from '@ant-design/icons';
import WeatherCard from '../WeatherCard/WeatherCard';
import {
    Carousel,
    Avatar,
    Rate,
    Spin,
    ConfigProvider,
    Button
} from 'antd';

import { Typography, App } from 'antd';
const { Title, Paragraph } = Typography;

import { Link } from 'react-router-dom';

import slugify from 'slugify';

import { motion } from 'framer-motion';

import { useContext } from 'react';

import { AuthContext } from '../../../../contexts/AuthContext';

import { favPlaceServiceFactory } from '../../../../services/favPlaceService';

import { fireError } from '../../../../utils/fireError';

const PlaceDetailsSection = ({
    place,
    mapUrl,
    loading,
    setPlace,
    isForAdmin,
}) => {

    const { token, userId, isAuthenticated } = useContext(AuthContext);

    const { message } = App.useApp();

    const favPlaceService = favPlaceServiceFactory(token);

    const isOwner = place.userId === userId;

    const onAddFavPlace = () => {
        favPlaceService
            .addToFavorites(place?.id)
            .then(res => {
                setPlace(prev => ({ ...prev, isFavPlace: true }));
                message.success(res.successMessage, 5);
            }).catch(err => {
                fireError(err);
            });
    }

    const onRemoveFavPlace = () => {
        favPlaceService
            .removeFromFavorites(place?.id)
            .then(res => {
                setPlace(prev => ({ ...prev, isFavPlace: false }));
                message.success(res.successMessage, 5);
            }).catch(err => {
                fireError(err);
            });
    }

    return (
        <section className={styles.placeDetailsSection}>

            {/* Header + Carousel */}
            <div className={styles.heroSection}>

                <div className={styles.placeInfo}>
                    <div className={styles.uploader}>
                        <Link
                            to={{ pathname: `/profile/${slugify(place.userName ?? '', { lower: true })}` }}
                            state={{ userId: place.userId }}
                        >
                            <Avatar
                                src={place.userProfileImageUrl}
                                icon={<UserOutlined />}
                                size={130}
                                className={styles.avatarHover}
                            />
                        </Link>
                        <span className={styles.userName}>{place.userName}</span>
                    </div>

                    <Title level={2} className={styles.placeName} style={{ color: isForAdmin ? '#fff' : 'black' }}>{place.name}</Title>

                </div>


                {loading ? (
                    <div className={styles.spinnerWrapper}>
                        <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'green' } } }}>
                            <Spin size="large" />
                        </ConfigProvider>
                    </div>
                ) : (
                    <Carousel className={styles.carousel} autoplay arrows dotPosition="bottom">
                        {place.imagesUrls?.map((url, idx) => (
                            <img src={url} alt={`Slide ${idx}`} key={idx} />
                        ))}
                    </Carousel>
                )}
            </div>

            {/* Description */}
            <div className={styles.sectionBox}>
                <Title level={3} className={styles.sectionTitle}>
                    <FileTextOutlined style={{ marginRight: 8 }} />
                    Description
                </Title>
                <Paragraph className={styles.descriptionText}>
                    {place.description}
                </Paragraph>
            </div>

            {/* Tags */}
            {place.tags?.length > 0 && (
                <div className={styles.sectionBox}>
                    <Typography.Title level={2} style={{ marginBottom: '2rem' }}>Tags</Typography.Title>
                    <div className={styles.tagList}>
                        {place.tags.map(tag => (
                            <span key={tag.id} className={styles.tag}>
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Review */}
            <div className={styles.reviewRow}>

                <div className={styles.review}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center' }}>
                        <div className={styles.reviewHeader}>
                            <Avatar size={100} src={place.userProfileImageUrl} />
                            <span style={{ fontSize: '2rem', color: 'black' }}>{place.userName}</span>
                        </div>
                        <Rate style={{ fontSize: '3rem' }} disabled value={place.userReviewRating} />
                    </div>

                    <Paragraph className={styles.reviewText}>
                        {place.userReviewContent}
                    </Paragraph>
                </div>

            </div>

            {/* {!isForAdmin && !isOwner && ( */}

            {place.isFavPlace && !isOwner && isAuthenticated && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        ease: [0.25, 0.8, 0.25, 1],
                    }}
                    className={styles.favoriteBox}
                >
                    <div className={styles.favoriteContent}>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography.Title level={4} style={{ margin: 0, fontSize: '2.5rem', color: '#52c41a' }}>
                                Already a Favorite ❤️
                            </Typography.Title>
                            <Typography.Paragraph style={{ marginBottom: 0, fontSize: '1.5rem', textAlign: 'center' }}>
                                You’ve added this place to your favorites.
                                <br />
                                Want to remove it?
                            </Typography.Paragraph>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                            <Button
                                type="primary"
                                size="large"
                                shape="round"
                                danger
                                icon={<HeartOutlined />}
                                style={{ fontSize: '2rem', padding: '2.5rem 3rem' }}
                                onClick={onRemoveFavPlace}
                            >
                                Remove from Favorites
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}

            {!place.isFavPlace && !isOwner && isAuthenticated && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        ease: [0.25, 0.8, 0.25, 1],
                    }}
                    className={styles.favoriteBox}
                >
                    <div className={styles.favoriteContent}>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography.Title level={4} style={{ margin: 0, fontSize: '2.5rem' }}>
                                Love this place?
                            </Typography.Title>
                            <Typography.Paragraph style={{ marginBottom: 0, fontSize: '1.5rem' }}>
                                Add it to your favorites to revisit it anytime!
                            </Typography.Paragraph>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                            <Button
                                type="primary"
                                size="large"
                                shape="round"
                                icon={<HeartOutlined />}
                                style={{ backgroundColor: '#eb2f96', borderColor: '#eb2f96', fontSize: '2rem', padding: '2.5rem 3rem' }}
                                onClick={onAddFavPlace}
                            >
                                Add to Favorites
                            </Button>
                        </div>

                    </div>
                </motion.div>
            )}

            {/* )} */}


            {/* Map + weather */}
            {!isForAdmin && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', alignContent: 'center', alignItems: 'center' }}>
                    {mapUrl && (
                        <div className={styles.mapIframeBox} style={{ width: '70%' }}>
                            <Typography.Title level={3}>Map</Typography.Title>
                            <iframe src={mapUrl} className={styles.mapIframe} allowFullScreen="" />
                        </div>
                    )}

                    <div className={styles.weatherBox} style={{ width: '30%' }}>
                        {place.weatherData?.current && Object.keys(place.weatherData.current).length > 0 && (
                            <WeatherCard isForAdmin={isForAdmin} data={place.weatherData} />
                        )}
                    </div>
                </div>
            )}


            {isForAdmin && (
                <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    {mapUrl && (
                        <div className={styles.mapIframeBox} style={{ width: '100%' }}>
                            <Typography.Title level={3}>Map</Typography.Title>
                            <iframe src={mapUrl} className={styles.mapIframe} allowFullScreen="" />
                        </div>
                    )}
                </div>
            )}

        </section>
    );
};

export default PlaceDetailsSection;
