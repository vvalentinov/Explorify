import styles from './PlaceDetailsSection.module.css';
import { FileTextFilled, HeartOutlined, EnvironmentFilled, TagFilled, UserOutlined } from '@ant-design/icons';
import WeatherCard from '../WeatherCard/WeatherCard';
import {
    Carousel,
    Avatar,
    Rate,
    Spin,
    ConfigProvider,
    Button,
} from 'antd';

import { Typography, App } from 'antd';
const { Title, Paragraph } = Typography;

import { motion } from 'framer-motion';

import { useContext } from 'react';

import { AuthContext } from '../../../../contexts/AuthContext';

import { favPlaceServiceFactory } from '../../../../services/favPlaceService';

import { fireError } from '../../../../utils/fireError';

import GoogleMapWithMarker from '../../../Maps/GoogleMaps';

const PlaceDetailsSection = ({
    place,
    loading,
    setPlace,
    isForAdmin,
    weatherData
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
        <>

            <section className={styles.heroSection}>


                <div className={`${styles.placeCard} ${isForAdmin ? styles.adminCard : styles.publicCard}`}>

                    {loading ? (
                        <div className={styles.spinnerWrapper}>
                            <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'green' } } }}>
                                <Spin size="large" />
                            </ConfigProvider>
                        </div>
                    ) : (
                        <>
                            <div className={styles.titleRatingRow}>
                                <Title
                                    level={3}
                                    className={`${styles.placeTitle} ${isForAdmin ? styles.adminTitle : ''}`}
                                >
                                    <span className={`${styles.titleIcon} ${isForAdmin ? styles.adminTitleIcon : ''}`}>
                                        <EnvironmentFilled className={`${styles.icon} ${isForAdmin ? styles.adminIcon : ''}`} />
                                    </span>
                                    {place?.name}, {place?.countryName}
                                </Title>

                                {!loading && (
                                    <div className={`${styles.avgRatingBadge} ${isForAdmin ? styles.adminRatingBadge : ''}`}>
                                        ★ {place.avgRating?.toFixed(1)} / 5.0
                                    </div>
                                )}
                            </div>

                            {isForAdmin && (
                                <div className={styles.categoryBadge}>
                                    <span className={styles.categoryLabel}>Category:</span>
                                    <span className={styles.categoryValue}>{place.category}</span>
                                </div>
                            )}

                            <Carousel className={styles.carousel} autoplay arrows dotPosition="bottom">
                                {place.imagesUrls?.map((url, idx) => (
                                    <img src={url} alt={`Slide ${idx}`} key={idx} />
                                ))}
                            </Carousel>
                        </>
                    )}
                </div>


                <div className={`${styles.ownerReview} ${isForAdmin ? styles.adminReview : styles.publicReview}`}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div className={styles.reviewHeader}>
                            <Avatar
                                size={60}
                                src={
                                    place.userProfileImageUrl?.trim() !== ''
                                        ? place.userProfileImageUrl
                                        : null
                                }
                                icon={
                                    !place.userProfileImageUrl?.trim()
                                        ? <UserOutlined />
                                        : undefined
                                }
                            />
                            <span className={`${styles.reviewerName} ${isForAdmin ? styles.adminName : ''}`}>
                                {place.userName}
                            </span>
                        </div>

                        <div
                            className={`${styles.rateWrapper} ${isForAdmin ? styles.adminRate : ''}`}
                        >
                            <Rate style={{ fontSize: '2rem' }} disabled value={place.userReviewRating} />
                        </div>
                    </div>

                    <Paragraph className={isForAdmin ? styles.adminReviewText : styles.reviewText}>
                        {place.userReviewContent}
                    </Paragraph>
                </div>

            </section>


            <section className={styles.descriptionTagsSection}>

                <div className={`${styles.descriptionCard} ${isForAdmin ? styles.adminDescriptionCard : styles.publicDescriptionCard}`}>
                    <Title
                        level={3}
                        className={`${styles.descriptionTitle} ${isForAdmin ? styles.adminTitle : styles.publicTitle}`}
                    >
                        <span className={`${styles.descriptionIcon} ${isForAdmin ? styles.adminDescriptionIcon : ''}`}>
                            <FileTextFilled />
                        </span>
                        Description
                    </Title>

                    <Paragraph className={`${styles.descriptionText} ${isForAdmin ? styles.adminDescriptionText : ''}`}>
                        {place.description}
                    </Paragraph>
                </div>

                <div
                    className={`${styles.tagsCard} ${isForAdmin ? styles.adminTagsCard : styles.publicTagsCard
                        }`}
                >
                    <Title
                        level={3}
                        className={`${styles.tagsTitle} ${isForAdmin ? styles.adminTitle : styles.publicTitle
                            }`}
                    >
                        <span
                            className={`${styles.tagsIcon} ${isForAdmin ? styles.adminTagsIcon : ''
                                }`}
                        >
                            <TagFilled />
                        </span>
                        Tags
                    </Title>

                    <div className={styles.tagList}>
                        {place.tags?.length ? (
                            place.tags.map(t => (
                                <span
                                    key={t.id}
                                    className={`${styles.tag} ${isForAdmin ? styles.adminTag : ''}`}
                                >
                                    {t.name}
                                </span>
                            ))
                        ) : (
                            <span
                                className={`${styles.noTags} ${isForAdmin ? styles.adminNoTags : ''
                                    }`}
                            >
                                No tags available
                            </span>
                        )}
                    </div>
                </div>

            </section>

            <section className={styles.mapWeatherSection}>

                <div className={styles.mapWeatherContainer}>

                    {(place?.latitude && place?.longitude) && (
                        <GoogleMapWithMarker isForAdmin={isForAdmin} lat={place.latitude} lng={place.longitude} />
                    )}

                    {!isForAdmin && (
                        <div className={styles.weatherBox}>
                            <WeatherCard data={weatherData} />
                        </div>
                    )}

                </div>

            </section>


            {/* Favorite Place */}
            {place.isFavPlace && !isOwner && isAuthenticated && !isForAdmin && (
                <section className={styles.favPlaceSection}>
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
                </section>
            )}

            {!place.isFavPlace && !isOwner && isAuthenticated && !isForAdmin && (

                <section className={styles.favPlaceSection}>
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
                </section>

            )}

        </>
    );
};

export default PlaceDetailsSection;
