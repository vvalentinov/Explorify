import styles from './PlaceDetailsSection.module.css';

import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons';

import WeatherCard from '../WeatherCard/WeatherCard';

import {
    Carousel,
    Card,
    Typography,
    Avatar,
    Rate,
    Tag,
    Flex,
    Spin,
    ConfigProvider
} from 'antd';

const PlaceDetailsSection = ({
    place,
    mapUrl,
    loading,
    isForAdmin
}) => {

    const adminBgCardColor = '#d4cadf';

    return (
        <section className={styles.placeDetailsCardSection}>
            <Card
                className={styles.placeDetailsCard}
                styles={{
                    header:
                    {
                        backgroundColor: isForAdmin ? '#89ADFF' : '#57ae53',
                    }
                }}
                title={
                    <div className={styles.cardHeader}>
                        <Avatar icon={<UserOutlined />} src={place.userProfileImageUrl} size={40} />
                        <span className={styles.placeTitle}>{place.name}</span>
                    </div>
                }
            >

                <Flex justify='center' align='start' gap={'2rem'} >

                    <div style={{ width: '60%' }}>

                        {
                            loading ?
                                <div style={{
                                    width: '100%',
                                    maxWidth: '700px',
                                    margin: '0 auto 1.5rem auto',
                                    borderRadius: '10px',
                                    border: 'solid 1px green',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: '300px'
                                }}>
                                    <ConfigProvider theme={{
                                        components: {
                                            Spin: {
                                                colorPrimary: 'green'
                                            }
                                        }
                                    }}>
                                        <Spin size='large' />
                                    </ConfigProvider>
                                </div> :
                                <div className={styles.carouselWrapperStyle}>
                                    <Carousel
                                        arrows
                                        dots
                                        infinite
                                        style={{ borderRadius: '10px' }}
                                    >
                                        {place.imagesUrls?.map((x, i) => (
                                            <div key={i}>
                                                <img
                                                    className={styles.imageStyle}
                                                    src={x}
                                                    alt={`Slide ${i}`}
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>
                        }

                        {/* )} */}

                        <Card
                            loading={loading}
                            styles={{
                                header:
                                {
                                    backgroundColor: isForAdmin ? '#89ADFF' : '#57ae53',
                                }
                            }}
                            style={{
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                            }}
                            title={
                                <span>
                                    <InfoCircleOutlined style={{ marginRight: '10px' }} />
                                    Description
                                </span>
                            }
                        >
                            <Typography.Paragraph style={{ textAlign: 'justify' }} className={styles.placeDescriptionParagraph}>
                                {place.description}
                            </Typography.Paragraph>
                        </Card>

                        {
                            mapUrl != '' &&
                            <iframe
                                src={mapUrl}
                                className={styles.mapIframe}
                                allowFullScreen=""
                                aria-hidden="false"
                                tabIndex="0"
                            ></iframe>
                        }

                    </div>


                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '40%'
                    }}>

                        <Card loading={loading}
                            style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)', width: '100%' }}
                            styles={{ header: { backgroundColor: isForAdmin ? '#89ADFF' : '#57ae53' } }}
                            title={
                                <div className={styles.reviewCardHeader}>
                                    <div className={styles.reviewCardHeaderContainer}>
                                        <Avatar src={place.userProfileImageUrl} size={40} />
                                        <span style={{ marginLeft: '10px' }} className={styles.placeTitle}>{place.userName}</span>
                                    </div>
                                    <div>
                                        <Rate style={{ padding: '0', margin: '0' }} disabled value={place.userReviewRating} />
                                    </div>
                                </div>
                            }
                        >
                            <Typography.Paragraph style={{ textAlign: 'justify' }} className={styles.placeDescriptionParagraph}>
                                {place.userReviewContent}
                            </Typography.Paragraph>

                        </Card>

                        {
                            place.tags?.length > 0 &&
                            <Card
                                loading={loading}
                                title={'Tags'}
                                styles={{
                                    header:
                                    {
                                        backgroundColor: isForAdmin ? '#89ADFF' : '#57ae53'
                                    }
                                }}
                                style={{
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                                    border: 'none',
                                    width: '100%'
                                }}>
                                <Flex gap="1rem" wrap>
                                    {place.tags?.map(x => <Tag
                                        style={{ padding: '5px 1rem', fontSize: '15px' }}
                                        key={x.id}
                                        color="green">
                                        {x.name}
                                    </Tag>)}
                                </Flex>
                            </Card>
                        }

                        {
                            place.weatherData?.current &&
                            Object.keys(place.weatherData.current).length > 0 &&
                            (
                                <WeatherCard isForAdmin={isForAdmin} data={place.weatherData} />
                            )
                        }

                    </div>

                </Flex>

            </Card>

        </section>
    );
};

export default PlaceDetailsSection;