import {
    CheckCircleOutlined,
    BellOutlined,
    TrophyOutlined,
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import {
    Typography,
    App,
    Space,
    Divider
} from 'antd';

import { fireError } from '../../utils/fireError';

import { useState, useContext } from 'react';

import { AuthContext } from '../../contexts/AuthContext';

import UnapproveReviewModal from './Modals/UnapproveReviewModal';
import DeleteReviewModal from './Modals/DeleteReviewModal';

import { reviewsServiceFactory } from '../../services/reviewsService';
import { adminServiceFactory } from '../../services/adminService';

import { motion } from 'framer-motion';
import ReviewCard from './ReviewCard/ReviewCard';

import OpenReviewModal from './Modals/OpenReviewModal';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const ReviewsList = ({
    reviews,
    setReviews,
    isForAdmin = false,
    isForUser = false,
    isForPlace = true
}) => {

    const { modal } = App.useApp();

    const { userId, token, isAuthenticated } = useContext(AuthContext);

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
    const [isUnapprovedModalOpen, setIsUnapprovedModalOpen] = useState(false);

    const adminService = adminServiceFactory(token);
    const reviewsService = reviewsServiceFactory(token);

    const handleOpenModal = (review) => {
        setSelectedReview(review);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReview(null);
    };

    const approveReviewModal = (review) => {
        modal.confirm({
            title: <span style={{ fontSize: '1.7rem' }}>Approve Review</span>,
            className: 'custom-approve-modal',
            icon: null,
            content: (
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Typography.Text type="secondary">
                        Are you sure you want to approve this review?
                    </Typography.Text>
                    <Divider style={{ margin: '8px 0' }} />
                    <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <Typography.Text>
                            This will mark the review as <Typography.Text strong>approved</Typography.Text> and make it visible on the site.
                        </Typography.Text>
                    </Space>
                    {review?.userId !== userId && (
                        <Space>
                            <BellOutlined style={{ color: '#faad14' }} />
                            <Typography.Text>
                                The reviewer will <Typography.Text strong>gain points</Typography.Text> and <Typography.Text strong>receive a notification</Typography.Text>.
                            </Typography.Text>
                        </Space>
                    )}
                    {review?.userId === userId && (
                        <Space>
                            <TrophyOutlined style={{ color: '#faad14' }} />
                            <Typography.Text>
                                You will <Typography.Text strong>gain points</Typography.Text>.
                            </Typography.Text>
                        </Space>
                    )}
                </Space>
            ),
            okText: 'Approve',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => handleApprove(review)
        });
    };

    const handleApprove = (review) => {
        adminService
            .approveReview(review.id)
            .then(res => {
                navigate('/admin', { state: { successOperation: { message: res.successMessage } } })
            }).catch(err => {
                fireError(err);
            });
    }

    const handleUnapprove = (review) => {
        setSelectedReview(review);
        setIsUnapprovedModalOpen(true);
    };

    const handleDelete = (review) => {
        setSelectedReview(review);
        setIsDeletedModalOpen(true);
    };

    const handleRevert = (reviewId) => {
        reviewsService.revertReview(reviewId).then(res => {
            navigate('/admin', { state: { successOperation: { message: res.successMessage } } })
        }).catch(err => {
            fireError(err);
        });
    }

    const onHelpfulBtnClick = () => {

        if (!isAuthenticated) {
            return;
        }

        const review = selectedReview;
        if (!review) return;

        const isLiked = !!review.hasLikedReview;

        const request = isLiked
            ? reviewsService.dislikeReview(review.id)
            : reviewsService.likeReview(review.id);

        request
            .then(res => {
                const updatedReview = {
                    ...review,
                    likes: res.likes,
                    hasLikedReview: !isLiked
                };

                setSelectedReview(updatedReview);
                setReviews(prev =>
                    prev.map(r => r.id === updatedReview.id ? updatedReview : r)
                );
            })
            .catch(err => {
                fireError(err);
            });
    };

    return (
        <>
            <section style={{ display: 'flex', justifyContent: 'center' }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        justifyContent: 'center',
                        // border: 'solid 1px black',
                    }}
                >
                    {reviews.map(review => (
                        <motion.div
                            key={review.id}
                            variants={cardVariants}
                            style={{
                                flexBasis: '32%',
                            }}
                        >

                            <ReviewCard
                                approveReviewModal={approveReviewModal}
                                handleDelete={handleDelete}
                                handleOpenModal={handleOpenModal}
                                handleRevert={handleRevert}
                                handleUnapprove={handleUnapprove}
                                isForPlace={isForPlace}
                                review={review}
                                isForUser={isForUser}
                                isForAdmin={isForAdmin}
                            />

                        </motion.div>
                    ))}
                </motion.div>
            </section>

            <UnapproveReviewModal
                placeUserId={selectedReview?.userId}
                reviewId={selectedReview?.id}
                reviewUserId={selectedReview?.userId}
                setVisible={setIsUnapprovedModalOpen}
                visible={isUnapprovedModalOpen}
            />

            <DeleteReviewModal
                reviewId={selectedReview?.id}
                isReviewApproved={selectedReview?.isApproved}
                reviewUserId={selectedReview?.userId}
                setVisible={setIsDeletedModalOpen}
                visible={isDeletedModalOpen}
            />

            <OpenReviewModal
                handleCloseModal={handleCloseModal}
                isModalOpen={isModalOpen}
                onHelpfulBtnClick={onHelpfulBtnClick}
                selectedReview={selectedReview}
                isForAdmin={isForAdmin}
            />

        </>
    );
};

export default ReviewsList;