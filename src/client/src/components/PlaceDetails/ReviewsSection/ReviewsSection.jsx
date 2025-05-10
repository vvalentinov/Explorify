import {
    Card,
    Typography,
    Avatar,
    Rate,
    Pagination,
    Spin,
    Radio,
    ConfigProvider
} from 'antd';

const options = [
    { label: 'Newest', value: 'Newest' },
    { label: 'Oldest', value: 'Oldest' },
    { label: 'Most Helpful', value: 'MostHelpful' },
];

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
    const [sortOption, setSortOption] = useState("Newest");

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
            .getReviews(place.id, page, sortOption)
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

    const handleSortChange = (e) => {

        setSortOption(e.target.value);

        setReviews([]);
        setSpinnerLoading(true);
        setCurrentPage(1);

        const MIN_SPINNER_TIME = 1000;
        const startTime = Date.now();

        reviewsService
            .getReviews(place.id, 1, e.target.value)
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
        <Card
            ref={reviewSectionRef}
            style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                border: 'solid 1px green',
                margin: '0 2rem',
                marginBottom: '2rem',
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
                        <ConfigProvider theme={{
                            components: {
                                Spin: {
                                    colorPrimary: 'green'
                                }
                            }
                        }}>
                            <Spin size='large' spinning={spinnerLoading} />
                        </ConfigProvider>
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