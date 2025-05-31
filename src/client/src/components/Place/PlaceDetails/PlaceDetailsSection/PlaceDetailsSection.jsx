import styles from './PlaceDetailsSection.module.css';
import { UserOutlined } from '@ant-design/icons';
import WeatherCard from '../WeatherCard/WeatherCard';
import {
    Carousel,
    Avatar,
    Rate,
    Spin,
    ConfigProvider
} from 'antd';

import { Typography } from 'antd';
const { Title, Paragraph } = Typography;

import { Link } from 'react-router-dom';

import slugify from 'slugify';

const PlaceDetailsSection = ({
    place,
    mapUrl,
    loading,
    isForAdmin
}) => {
    return (
        <section className={styles.placeDetailsSection}>
            {/* Header + Carousel */}
            <div className={styles.heroSection}>

                {/* <div className={styles.placeInfo}>
                    <h1>{place.name}</h1>
                    <div className={styles.meta}>
                        <Link
                            to={{ pathname: `/profile/${slugify(place.userName ?? '', { lower: true })}` }}
                            state={{ userId: place.userId }}
                        >
                            <Avatar src={place.userProfileImageUrl} icon={<UserOutlined />} />
                        </Link>

                        <span>{place.userName}</span>
                    </div>
                </div> */}

                <div className={styles.placeInfo}>
                    <h1 className={styles.placeName}>{place.name}</h1>
                    <div className={styles.uploader}>
                        <Link
                            to={{ pathname: `/profile/${slugify(place.userName ?? '', { lower: true })}` }}
                            state={{ userId: place.userId }}
                        >
                            <Avatar
                                src={place.userProfileImageUrl}
                                icon={<UserOutlined />}
                                size={64}
                                className={styles.avatarHover}
                            />
                        </Link>
                        <span className={styles.userName}>{place.userName}</span>
                    </div>
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
                <Title level={3} className={styles.sectionTitle}>Description</Title>
                <Paragraph className={styles.descriptionText}>
                    {place.description}
                </Paragraph>
            </div>

            {/* Tags */}
            {place.tags?.length > 0 && (
                <div className={styles.sectionBox}>
                    <h2>Tags</h2>
                    <div className={styles.tagList}>
                        {place.tags.map(tag => (
                            <span key={tag.id} className={styles.tag}>
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Review + Weather */}
            <div className={styles.reviewWeatherRow}>

                <div className={styles.reviewBox}>
                    <div className={styles.sectionBox}>
                        <div className={styles.reviewHeader}>
                            <Avatar src={place.userProfileImageUrl} />
                            <span>{place.userName}</span>
                        </div>
                        <Rate disabled value={place.userReviewRating} />
                        <Paragraph className={styles.reviewText}>
                            {place.userReviewContent}
                        </Paragraph>
                    </div>
                </div>


                <div className={styles.weatherBox}>
                    {place.weatherData?.current && Object.keys(place.weatherData.current).length > 0 && (
                        <WeatherCard isForAdmin={isForAdmin} data={place.weatherData} />
                    )}
                </div>
            </div>

            {/* Map at bottom */}
            {mapUrl && (
                <div className={styles.sectionBox}>
                    <h2>Map</h2>
                    <iframe src={mapUrl} className={styles.mapIframe} allowFullScreen="" />
                </div>
            )}
        </section>
    );
};

export default PlaceDetailsSection;
