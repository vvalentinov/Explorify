import {
    Card,
    Typography,
    Avatar,
    Rate,
    Pagination,
    Spin
} from 'antd';

import styles from './ReviewsSection.module.css';

import { useState, useRef, useLayoutEffect } from "react";

import { fireError } from "../../../utils/fireError";

import WriteReviewCard from '../WriteReviewCard';

const ReviewsSection = ({
    reviewsService,
    setSelectedReview,
    setIsReviewModalOpen,
    setIsModalOpen,
    reviews,
    setReviews,
    pagesCount,
    setPagesCount,
    place,
    userId,
}) => {

    // State
    const [currentPage, setCurrentPage] = useState(1);
    const [shouldScroll, setShouldScroll] = useState(false);
    const [spinnerLoading, setSpinnerLoading] = useState(false);

    const reviewSectionRef = useRef(null);

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

        const MIN_SPINNER_TIME = 1000;
        const startTime = Date.now();

        reviewsService
            .getReviews(place.id, page)
            .then(res => {
                const elapsed = Date.now() - startTime;
                const remaining = MIN_SPINNER_TIME - elapsed;

                setTimeout(() => {
                    setReviews(res.reviews);
                    setPagesCount(res.pagesCount);
                    setSpinnerLoading(false);
                    setShouldScroll(true);
                }, remaining > 0 ? remaining : 0);
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
        <Card ref={reviewSectionRef}
            style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)' }}
            title='Reviews Section'
            className={styles.reviewsSection}
            styles={{ header: { backgroundColor: '#e8fffb', border: '1px solid green' } }}
        >

            {place.userId != userId && <WriteReviewCard handleOpenModal={handleOpenModal} />}

            <div className={styles.reviewsContainer}>
                {
                    reviews.length > 0 ?
                        (
                            reviews.map(x => (
                                <Card
                                    onClick={() => handleCardClick(x)}
                                    style={{
                                        width: '300px',
                                        height: '350px',
                                        overflow: 'hidden',
                                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.06)'
                                    }}
                                    key={x.user.userName}
                                    styles={{
                                        header: {
                                            backgroundColor: '#e8fffb',
                                        }
                                    }}
                                    className={styles.reviewCard}
                                    title={
                                        <div className={styles.reviewCardHeader}>
                                            <div className={styles.reviewCardHeaderContainer}>
                                                <Avatar src={x.user.profileImageUrl} size={40} />
                                                <span style={{ marginLeft: '5px' }} className={styles.placeTitle}>{x.user.userName}</span>
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
                            ))
                        ) :
                        <Spin size='large' spinning={spinnerLoading} />
                }
            </div>

            <Pagination
                align='center'
                onChange={handlePageChange}
                current={currentPage}
                total={pagesCount * 6}
                pageSize={6}
                style={{ textAlign: 'center', marginTop: '2rem' }}
            />

        </Card>
    )
};

export default ReviewsSection;