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

                <div
                    className={styles.placeCard}
                >
                    {loading ? (
                        <div className={styles.spinnerWrapper}>
                            <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'green' } } }}>
                                <Spin size="large" />
                            </ConfigProvider>
                        </div>
                    ) : (
                        <>
                            <Title
                                level={3}
                                style={{
                                    textAlign: 'left',
                                    marginBottom: '1.1rem',
                                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                                    fontWeight: 700,
                                    fontSize: '2.2rem',
                                    letterSpacing: '0.4px',
                                    color: '#1A7F64',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                    width: '100%'
                                }}
                            >
                                <span
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '50%',
                                        padding: '0.5rem',
                                        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: 'solid 1px lightgrey'
                                    }}
                                >
                                    <EnvironmentFilled style={{ color: '#1A7F64', fontSize: '2rem' }} />
                                </span>
                                {place?.name}
                            </Title>

                            <Carousel className={styles.carousel} autoplay arrows dotPosition="bottom">
                                {place.imagesUrls?.map((url, idx) => (
                                    <img src={url} alt={`Slide ${idx}`} key={idx} />
                                ))}
                            </Carousel>
                        </>

                    )}
                </div>

                <div className={styles.ownerReview}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <div className={styles.reviewHeader}>
                            <Avatar
                                size={60}
                                src={place.userProfileImageUrl && place.userProfileImageUrl.trim() !== '' ? place.userProfileImageUrl : null}
                                icon={!place.userProfileImageUrl || place.userProfileImageUrl.trim() === '' ? <UserOutlined /> : undefined}
                            />
                            <span style={{ fontSize: '1.5rem', color: 'black', fontWeight: '600', fontFamily: "'Poppins', 'Segoe UI', sans-serif", }}>{place.userName}</span>
                        </div>
                        <Rate style={{ fontSize: '2rem' }} disabled value={place.userReviewRating} />
                    </div>

                    <Paragraph className={styles.reviewText}>
                        {place.userReviewContent}
                    </Paragraph>
                </div>

            </section>


            <section className={styles.descriptionTagsSection}>

                <div className={styles.descriptionCard}>

                    <Title
                        level={3}
                        style={{
                            textAlign: 'left',
                            marginBottom: '1.1rem',
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                            fontWeight: 700,
                            fontSize: '1.7rem',
                            letterSpacing: '0.4px',
                            color: '#1A7F64',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: '0.6rem',
                            width: '100%'
                        }}
                    >
                        <span
                            style={{
                                backgroundColor: '#ffffff',
                                borderRadius: '50%',
                                padding: '0.5rem',
                                boxShadow: '0 3px 8px rgba(0, 0, 0, 0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'solid 1px lightgrey'
                            }}
                        >
                            <FileTextFilled style={{ color: '#1A7F64', fontSize: '2rem' }} />
                        </span>
                        Description
                    </Title>
                    <Paragraph className={styles.descriptionText}>
                        {place.description}
                    </Paragraph>
                </div>

                <div className={styles.tagsCard}>

                    <Title
                        level={3}
                        style={{
                            textAlign: 'left',
                            marginBottom: '2rem',
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                            fontWeight: 700,
                            fontSize: '2.2rem',
                            letterSpacing: '0.4px',
                            color: '#1A7F64',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: '0.6rem',
                            width: '100%',
                            marginTop: 0
                        }}
                    >
                        <span
                            style={{
                                backgroundColor: '#ffffff',
                                borderRadius: '50%',
                                padding: '0.5rem',
                                boxShadow: '0 3px 8px rgba(0, 0, 0, 0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <TagFilled style={{ color: '#1A7F64', fontSize: '2rem' }} />
                        </span>
                        Tags
                    </Title>
                    <div className={styles.tagList}>
                        {
                            place.tags?.length > 0 ?
                                place.tags?.map(tag => (<span key={tag.id} className={styles.tag}>{tag.name}</span>)) :
                                <span
                                    style={{
                                        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                                        fontSize: '1.6rem',
                                        // textAlign: 'center',
                                        // display: 'block',
                                        width: '100%',
                                        marginTop: '1rem',
                                        color: '#888',
                                    }}
                                >
                                    No tags available
                                </span>
                        }
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
            {place.isFavPlace && !isOwner && isAuthenticated && (
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

            {!place.isFavPlace && !isOwner && isAuthenticated && (

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
