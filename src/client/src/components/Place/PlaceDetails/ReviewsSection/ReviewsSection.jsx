import {
    Card,
    Typography,
    Avatar,
    Rate,
    Pagination,
    Spin,
    Radio,
    ConfigProvider,
    Empty
} from 'antd';

const options = [
    { label: 'Newest', value: 'Newest' },
    { label: 'Oldest', value: 'Oldest' },
    { label: 'Most Helpful', value: 'MostHelpful' },
];

import styles from './ReviewsSection.module.css';

import { useState, useRef, useLayoutEffect, useEffect } from "react";

import { fireError } from "../../../../utils/fireError";

import WriteReviewCard from '../WriteReviewCard';
import ReviewModal from '../ReviewModal';
import UploadReviewModal from '../UploadReviewModal';

import { UserOutlined } from '@ant-design/icons';

const ReviewsSection = ({
    reviewsService,
    place,
    userId,
}) => {

    // State
    const [currentPage, setCurrentPage] = useState(1);
    const [shouldScroll, setShouldScroll] = useState(false);
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [sortOption, setSortOption] = useState("Newest");
    const [pagesCount, setPagesCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviews, setReviews] = useState([]);

    const reviewSectionRef = useRef(null);

    useEffect(() => {
        reviewsService
            .getPlaceReviews(place?.id, 1, "Newest")
            .then(res => {
                setReviews(res.reviews);
                setPagesCount(res.pagesCount);
            }).catch(err => {
                fireError(err);
            });
    }, []);

    useLayoutEffect(() => {
        if (shouldScroll && reviewSectionRef.current) {
            reviewSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setShouldScroll(false);
        }
    }, [shouldScroll]);

    const handlePageChange = (page) => {

        setReviews([]);
        setSpinnerLoading(true);
        setCurrentPage(page);

        reviewsService
            .getReviews(place.id, page, sortOption)
            .then(res => {

                setReviews(res.reviews);
                setPagesCount(res.pagesCount);
                setSpinnerLoading(false);
                setShouldScroll(true);

            })
            .catch(err => {
                setSpinnerLoading(false);
                fireError(err);
            });
    };

    const handleSortChange = (e) => {

        setSortOption(e.target.value);

        setReviews([]);
        setSpinnerLoading(true);
        setCurrentPage(1);

        reviewsService
            .getReviews(place.id, 1, e.target.value)
            .then(res => {
                setReviews(res.reviews);
                setPagesCount(res.pagesCount);
                setSpinnerLoading(false);
                setShouldScroll(true);
            })
            .catch(err => {
                setSpinnerLoading(false);
                fireError(err);
            });
    };

    const handleCardClick = (review) => {
        setSelectedReview(review);
        setIsReviewModalOpen(true);
    };

    const handleOpenModal = () => setIsModalOpen(true);

    return (
        <Card
            ref={reviewSectionRef}
            style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                border: 'solid 1px green',
                margin: '2rem 3rem',
            }}
            title='Reviews Section'
            className={styles.reviewsSection}
            styles={{
                header: {
                    backgroundColor: '#e8fffb',
                    borderBottom: 'solid 1px green'
                }
            }}
        >

            {place.userId != userId && <WriteReviewCard handleOpenModal={handleOpenModal} />}

            {pagesCount > 1 && <>
                {/* Order the reviews */}
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Card
                        style={{
                            width: '60%',
                            padding: '1rem 2rem',
                            backgroundColor: '#f3e9fe',
                            border: '1px solid #9c4dcc',
                            borderRadius: '16px',
                            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center',
                            marginTop: '2rem'
                        }}
                    >
                        <ConfigProvider
                            theme={{
                                components: {
                                    Radio: {
                                        colorPrimary: '#9c4dcc',
                                        buttonBg: '#e6d4f5',
                                        buttonColor: '#6a2c91',
                                        buttonSolidCheckedBg: '#9c4dcc',
                                        buttonSolidCheckedColor: 'white',
                                        buttonSolidCheckedHoverBg: '#8a3dac',
                                        buttonSolidCheckedActiveBg: '#9c4dcc',
                                        borderRadius: 12,
                                    },
                                },
                            }}
                        >
                            <Typography.Paragraph italic={true}>
                                Order Reviews
                            </Typography.Paragraph>

                            <Radio.Group
                                options={options}
                                defaultValue={sortOption}
                                optionType="button"
                                value={sortOption}
                                buttonStyle="solid"
                                size="large"
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    flexWrap: 'wrap',
                                }}
                                onChange={handleSortChange}
                                name='Sort'
                            />
                        </ConfigProvider>
                    </Card>
                </div>
            </>}

            <div className={styles.reviewsContainer}>

                {
                    spinnerLoading ? (
                        <ConfigProvider theme={{
                            components: {
                                Spin: { colorPrimary: 'green' }
                            }
                        }}>
                            <Spin size='large' spinning={spinnerLoading} />
                        </ConfigProvider>
                    ) : reviews.length === 0 ? (
                        <Empty description="No reviews yet." />
                    ) : (
                        reviews.map(x => (
                            <Card
                                onClick={() => handleCardClick(x)}
                                style={{
                                    width: '300px',
                                    height: '350px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.06)'
                                }}
                                key={x.userName}
                                styles={{
                                    header: {
                                        backgroundColor: '#e8fffb',
                                    }
                                }}
                                className={styles.reviewCard}
                                title={
                                    <div className={styles.reviewCardHeader}>
                                        <div className={styles.reviewCardHeaderContainer}>
                                            <Avatar
                                                src={x.profileImageUrl || undefined}
                                                size={40}
                                                icon={!x.profileImageUrl && <UserOutlined />}
                                            />
                                            <span style={{ marginLeft: '5px' }} className={styles.placeTitle}>{x.userName}</span>
                                        </div>
                                        <div>
                                            <Rate style={{ padding: '0', margin: '0' }} disabled value={x.rating} />
                                        </div>
                                    </div>
                                }
                            >
                                <Typography.Paragraph
                                    style={{ textAlign: 'justify' }}
                                    ellipsis={{ rows: 11 }}
                                >
                                    {x.content}
                                </Typography.Paragraph>

                            </Card>
                        )
                        )
                    )
                }

            </div >

            {pagesCount > 1 && <Pagination
                align='center'
                onChange={handlePageChange}
                current={currentPage}
                total={pagesCount * 6}
                pageSize={6}
                style={{ textAlign: 'center', marginTop: '2rem' }}
            />}

            <ReviewModal
                isReviewModalOpen={isReviewModalOpen}
                selectedReview={selectedReview}
                setIsReviewModalOpen={setIsReviewModalOpen}
                reviewsService={reviewsService}
                setSelectedReview={setSelectedReview}
                setReviews={setReviews}
            />

            <UploadReviewModal
                placeId={place.id}
                isModalOpen={isModalOpen}
                reviewService={reviewsService}
                setIsModalOpen={setIsModalOpen}
            />

        </Card >
    )
};

export default ReviewsSection;