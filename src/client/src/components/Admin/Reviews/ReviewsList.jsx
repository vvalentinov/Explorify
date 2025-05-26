import styles from './styles.module.css';

import { EnvironmentOutlined, ExclamationCircleOutlined, UserOutlined, PictureOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import {
    Pagination,
    ConfigProvider,
    Spin,
    Card,
    Typography,
    Radio,
    Empty,
    Avatar,
    Rate,
    Button,
    App,
    Modal,
    Image,
} from 'antd';

import { motion } from 'framer-motion';

import { fireError } from '../../../utils/fireError';

import { useState, useContext } from 'react';

import { AuthContext } from '../../../contexts/AuthContext';

import UnapproveReviewModal from './Modals/UnapproveReviewModal';
import DeleteReviewModal from './Modals/DeleteReviewModal';

import { reviewsServiceFactory } from '../../../services/reviewsService';

const ReviewsList = ({ reviews, adminService }) => {

    const { modal } = App.useApp();

    const { userId, token } = useContext(AuthContext);

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
    const [isUnapprovedModalOpen, setIsUnapprovedModalOpen] = useState(false);

    const reviewsService = reviewsServiceFactory(token);

    const handleOpenModal = (review) => {
        setSelectedReview(review);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReview(null);
    };

    const approveReviewModal = (reviewId) => {
        modal.confirm({
            title: 'Approve Review',
            icon: <ExclamationCircleOutlined />,
            content: (
                <>
                    <div>
                        <Typography.Text type="secondary" strong>
                            Are you sure you want to approve this review?
                        </Typography.Text>
                    </div>
                    <div>
                        <Typography.Text type="danger" strong>
                            This action will mark the review as approved and the review will be visible on the site.
                        </Typography.Text>
                    </div>
                    {selectedReview?.userId != userId && <div>
                        <Typography.Text type="danger" strong>
                            The user will gain points and receive notification.
                        </Typography.Text>
                    </div>}

                </>
            ),
            okText: 'Approve',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => handleApprove(reviewId)
        });
    };

    const handleApprove = (reviewId) => {
        adminService
            .approveReview(reviewId)
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

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                    marginTop: '1rem'
                }}>
                {reviews.map(review => (
                    <Card
                        key={review.userName}
                        style={{
                            // width: '300px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.06)'
                        }}
                        styles={{
                            header: { backgroundColor: '#e8fffb' }
                        }}
                        className={styles.reviewCard}
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className={styles.reviewCardHeader}>
                                <div style={{ display: 'flex', alignItems: 'center' }} className={styles.reviewCardHeaderContainer}>
                                    <Avatar
                                        src={review.profileImageUrl || undefined}
                                        size={40}
                                        icon={!review.profileImageUrl && <UserOutlined />}
                                    />
                                    <span style={{ marginLeft: '5px' }} className={styles.placeTitle}>{review.userName}</span>
                                </div>
                                <Rate style={{ padding: '0', margin: '0' }} disabled value={review.rating} />
                            </div>
                        }
                    >
                        <Typography.Paragraph
                            style={{ textAlign: 'justify' }}
                            ellipsis={{ rows: 5 }}
                        >
                            {review.content}
                        </Typography.Paragraph>

                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', flexWrap: 'wrap' }}>
                            <Button type="primary" onClick={() => handleOpenModal(review)}>
                                Open
                            </Button>
                            {review.isDeleted ? (
                                <Button type="primary" onClick={() => handleRevert(review.id)}>
                                    Revert
                                </Button>
                            ) : review.isApproved ? (
                                <>
                                    <Button danger onClick={() => handleUnapprove(review)}>
                                        Unapprove
                                    </Button>
                                    <Button danger onClick={() => handleDelete(review)}>
                                        Delete
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button type="primary" onClick={() => {
                                        approveReviewModal(review.id);
                                    }}>
                                        Approve
                                    </Button>
                                    <Button danger onClick={() => handleDelete(review)}>
                                        Delete
                                    </Button>
                                </>
                            )}
                        </div>

                    </Card>
                ))}
            </div>

            <UnapproveReviewModal
                placeUserId={selectedReview?.userId}
                reviewId={selectedReview?.id}
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

            <Modal
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                title={selectedReview ? `${selectedReview.userName}'s Review` : ''}
                style={{ top: 30 }}
            >
                {selectedReview && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>

                            <Avatar
                                src={selectedReview.profileImageUrl || undefined}
                                size={40}
                                icon={!selectedReview.profileImageUrl && <UserOutlined />}
                            />

                            <Rate disabled value={selectedReview.rating} />
                        </div>

                        {selectedReview?.imagesUrls?.length > 0 && (
                            <Card
                                title={<span><PictureOutlined style={{ marginRight: 8 }} />Images</span>}
                                size="small"
                                style={{
                                    marginTop: '1.5rem',
                                    backgroundColor: '#f6ffed',
                                    border: '1px solid #b7eb8f',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                }}
                                styles={{
                                    header: {
                                        backgroundColor: '#e6fffb', fontWeight: 'bold'
                                    }
                                }}
                            >
                                <Image.PreviewGroup>
                                    <div style={{
                                        display: 'flex',
                                        gap: '10px',
                                        flexWrap: 'wrap',
                                        justifyContent: 'flex-start'
                                    }}
                                    >
                                        {selectedReview.imagesUrls.map((url, index) => (
                                            <Image
                                                key={index}
                                                src={url}
                                                width={100}
                                                height={100}
                                                style={{
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                                                    transition: 'transform 0.2s ease-in-out',
                                                }}
                                                preview
                                            />
                                        ))}
                                    </div>
                                </Image.PreviewGroup>
                            </Card>
                        )}

                        <Typography.Paragraph style={{ textAlign: 'justify' }}>
                            {selectedReview.content}
                        </Typography.Paragraph>
                    </>
                )}
            </Modal>
        </>
    );
};

export default ReviewsList;