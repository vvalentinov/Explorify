// import styles from './PlaceDetailsSection.module.css';

// import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons';

// import WeatherCard from '../WeatherCard/WeatherCard';

// import {
//     Carousel,
//     Card,
//     Typography,
//     Avatar,
//     Rate,
//     Tag,
//     Flex,
//     Spin,
//     ConfigProvider
// } from 'antd';

// const PlaceDetailsSection = ({
//     place,
//     mapUrl,
//     loading,
//     isForAdmin
// }) => {

//     return (

//         <section className={styles.placeDetailsSection}>
//             <div className={styles.heroSection}>
//                 <div className={styles.placeInfo}>
//                     <h1>{place.name}</h1>
//                     <div className={styles.meta}>
//                         <Avatar src={place.userProfileImageUrl} icon={<UserOutlined />} />
//                         <span>{place.userName}</span>
//                     </div>
//                 </div>

//                 {loading ? (
//                     <div className={styles.spinnerWrapper}>
//                         <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'green' } } }}>
//                             <Spin size="large" />
//                         </ConfigProvider>
//                     </div>
//                 ) : (
//                     <Carousel className={styles.carousel} autoplay arrows dotPosition="bottom">
//                         {place.imagesUrls?.map((url, idx) => (
//                             <img src={url} alt={`Slide ${idx}`} key={idx} />
//                         ))}
//                     </Carousel>
//                 )}
//             </div>

//             {/* 👇 Full width description before flex layout */}
//             <div className={styles.sectionBox}>
//                 <h2>Description</h2>
//                 <p>{place.description}</p>
//             </div>

//             <div className={styles.detailsFlex}>
//                 <div className={styles.leftColumn}>
//                     {mapUrl && (
//                         <div className={styles.sectionBox}>
//                             <h2>Map</h2>
//                             <iframe src={mapUrl} className={styles.mapIframe} allowFullScreen="" />
//                         </div>
//                     )}

//                     {place.tags?.length > 0 && (
//                         <div className={styles.sectionBox}>
//                             <h2>Tags</h2>
//                             <div className={styles.tagList}>
//                                 {place.tags.map(tag => (
//                                     <span key={tag.id} className={styles.tag}>
//                                         {tag.name}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div className={styles.rightColumn}>
//                     <div className={styles.sectionBox}>
//                         <div className={styles.reviewHeader}>
//                             <Avatar src={place.userProfileImageUrl} />
//                             <span>{place.userName}</span>
//                         </div>
//                         <Rate disabled value={place.userReviewRating} />
//                         <p>{place.userReviewContent}</p>
//                     </div>

//                     {place.weatherData?.current && Object.keys(place.weatherData.current).length > 0 && (
//                         <WeatherCard isForAdmin={isForAdmin} data={place.weatherData} />
//                     )}
//                 </div>
//             </div>
//         </section>

//     );
// };

// export default PlaceDetailsSection;

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
                <div className={styles.placeInfo}>
                    <h1>{place.name}</h1>
                    <div className={styles.meta}>
                        <Avatar src={place.userProfileImageUrl} icon={<UserOutlined />} />
                        <span>{place.userName}</span>
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
