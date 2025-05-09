import styles from './PlaceDetailsSection.module.css';

import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons';

import {
    Carousel,
    Card,
    Typography,
    Avatar,
    Rate,
} from 'antd';

const PlaceDetailsSection = ({ place }) => {
    return (
        <section className={styles.placeDetailsCardSection}>
            <Card
                style={{ border: '1px solid green' }}
                styles={{ header: { backgroundColor: '#e8fffb', borderBottom: '1px solid green' } }}
                title={
                    <div className={styles.cardHeader}>
                        <Avatar icon={<UserOutlined />} src={place.userProfileImageUrl} size={40} />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            marginLeft: '1rem'
                        }}
                        >
                            <span className={styles.placeTitle}>{place.name}</span>
                            <span style={{
                                fontSize: '0.8rem',
                                fontStyle: 'italic',
                            }}
                            >
                                uploaded by: {place.userName}</span>
                        </div>

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
                    className={styles.placeDescriptionCard}
                    styles={{
                        header:
                            { backgroundColor: '#e8fffb', borderBottom: '1px solid green' }
                    }}
                    style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)', border: '1px solid green' }}
                    title={
                        <span>
                            <InfoCircleOutlined style={{ marginRight: '5px' }} />
                            Description
                        </span>
                    }
                >
                    <Typography.Paragraph style={{ textAlign: 'justify' }} className={styles.placeDescriptionParagraph}>
                        {place.description}
                    </Typography.Paragraph>
                </Card>

            </Card>

            <Card
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', border: '1px solid green' }}
                styles={{ header: { backgroundColor: '#e8fffb', borderBottom: '1px solid green' } }}
                className={styles.userReviewCard}
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

        </section>
    );
};

export default PlaceDetailsSection;