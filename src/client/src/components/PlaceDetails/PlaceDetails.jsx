import styles from './PlaceDetails.module.css';

import { useLocation } from "react-router-dom";

import { useState, useEffect } from "react";

import { placesServiceFactory } from "../../services/placesService";

import { fireError } from "../../utils/fireError";

import { UserOutlined } from '@ant-design/icons';

import { Carousel, Card, Typography, Avatar, Rate } from 'antd';

const PlaceDetails = () => {

    const placeService = placesServiceFactory();

    const location = useLocation();

    const [place, setPlace] = useState({});

    useEffect(() => {

        if (location.state?.placeId) {
            placeService
                .getPlaceDetailsById(location.state?.placeId)
                .then(res => setPlace(res))
                .catch(err => fireError(err));
        }

    }, []);

    return (
        <>
            {place && (
                <section className={styles.placeDetailsCardSection}>
                    <Card
                        styles={{
                            header: {
                                // borderBottom: 'solid 1px black',
                                backgroundColor: '#e8fffb'
                            }
                        }}
                        title={
                            <div className={styles.cardHeader}>
                                <Avatar icon={<UserOutlined />} src={place.avatarUrl} size={40} />
                                <span className={styles.placeTitle}>{place.name}</span>
                            </div>
                        }
                        className={styles.placeDetailsCard}
                    >
                        {place.imagesUrls?.length > 0 && (
                            <div className={styles.carouselWrapperStyle}>
                                <Carousel
                                    arrows
                                    dots
                                    // autoplay
                                    infinite
                                    style={{ borderRadius: '10px' }}
                                >
                                    {place.imagesUrls.map((x, i) => (
                                        <div key={i}>
                                            <img className={styles.imageStyle} src={x} alt={`Slide ${i}`} />
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        )}

                        <Card
                            styles={{
                                header: {
                                    // borderBottom: 'solid 1px black',
                                    backgroundColor: '#e8fffb'
                                },
                                body: {
                                    // backgroundColor: '#f5f7fa'
                                }
                            }}
                            title="Description"
                            className={styles.placeDescriptionCard}
                        >
                            <Typography.Paragraph className={styles.placeDescriptionParagraph}>
                                {place.description}
                            </Typography.Paragraph>
                        </Card>

                    </Card>

                    <Card
                        styles={{
                            header: {
                                // borderBottom: 'solid 1px black',
                                backgroundColor: '#e8fffb'
                            }
                        }}
                        className={styles.userReviewCard}
                        title={
                            <div className={styles.reviewCardHeader}>
                                <div className={styles.reviewCardHeaderContainer}>
                                    <Avatar icon={<UserOutlined />} size={40} />
                                    <span className={styles.placeTitle}>UserName</span>
                                </div>
                                <div>
                                    <Rate style={{ padding: '0', margin: '0' }} disabled value={place.userReviewRating} />

                                </div>

                            </div>
                        }
                    >
                        <Typography.Paragraph className={styles.placeDescriptionParagraph}>
                            {place.userReviewContent}
                        </Typography.Paragraph>

                    </Card>

                </section>
            )}
        </>
    )
};

export default PlaceDetails;