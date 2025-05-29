import styles from './styles.module.css';

import {
    ExclamationCircleOutlined,
    UserOutlined,
    PictureOutlined,
    CheckCircleOutlined,
    BellOutlined,
    TrophyOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    LikeOutlined
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import {
    Card,
    Typography,
    Avatar,
    Rate,
    Button,
    App,
    Modal,
    Image,
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

    const { userId, token } = useContext(AuthContext);

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
            title: 'Approve Review',
            icon: <ExclamationCircleOutlined />,
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

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    justifyContent: 'center',
                    marginTop: '1.5rem'
                }}
            >
                {reviews.map(review => (
                    <motion.div
                        key={review.id}
                        variants={cardVariants}
                        style={{
                            flex: '1 1 300px', // allows wrapping and sizing
                            maxWidth: '350px', // prevents full row stretch
                            minWidth: '280px', // optional: controls responsiveness
                        }}
                    >
                        <Card
                            key={review.id}
                            style={{
                                overflow: 'hidden',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.06)',
                                border: 'none'
                            }}
                            styles={{
                                header: {
                                    backgroundColor: !isForAdmin ? '#5fad55' : '#e8fffb'
                                }
                            }}
                            hoverable={isForPlace}
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
                            onClick={() => isForPlace ? handleOpenModal(review) : undefined}
                        >
                            <Typography.Paragraph
                                style={{ textAlign: 'justify' }}
                                ellipsis={{ rows: isForPlace ? 10 : 5 }}
                            >
                                {review.content}
                            </Typography.Paragraph>

                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', flexWrap: 'wrap' }}>

                                {!isForPlace && (
                                    <Button
                                        icon={<EyeOutlined />}
                                        variant="solid"
                                        color={isForAdmin ? 'primary' : 'cyan'}
                                        onClick={() => handleOpenModal(review)}
                                    >
                                        Open
                                    </Button>
                                )}

                                {isForUser && (
                                    <>

                                        {!review.isDeleted && (
                                            <>
                                                <Button
                                                    icon={<EditOutlined />}
                                                    variant="solid"
                                                    color="gold"
                                                    onClick={() => navigate('/review/edit', { state: { reviewId: review.id } })}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    icon={<DeleteOutlined />}
                                                    variant="solid"
                                                    color="danger"
                                                    onClick={() => handleDelete(review)}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}

                                        {review.isDeleted && !review.isDeletedByAdmin && (
                                            <Button type="primary" onClick={() => handleRevert(review.id)}>
                                                Revert
                                            </Button>
                                        )}
                                    </>
                                )}


                                {
                                    isForAdmin &&
                                    (
                                        <>
                                            {review.isDeleted ?
                                                (
                                                    <Button type="primary" onClick={() => handleRevert(review.id)}>
                                                        Revert
                                                    </Button>
                                                ) : review.isApproved ?
                                                    (
                                                        <>
                                                            <Button variant='solid' color='yellow' onClick={() => handleUnapprove(review)}>
                                                                Unapprove
                                                            </Button>
                                                            <Button variant='solid' color='danger' onClick={() => handleDelete(review)}>
                                                                Delete
                                                            </Button>
                                                        </>
                                                    ) :
                                                    (
                                                        <>
                                                            <Button variant='solid' color='green' onClick={() => approveReviewModal(review)}>
                                                                Approve
                                                            </Button>
                                                            <Button variant='solid' color='red' onClick={() => handleDelete(review)}>
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                        </>
                                    )
                                }

                            </div>

                        </Card>
                    </motion.div>
                ))}
            </motion.div>

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
                width={600}
            >
                {selectedReview && (
                    <>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                    src={selectedReview?.profileImageUrl || undefined}
                                    size={40}
                                    icon={!selectedReview?.profileImageUrl && <UserOutlined />}
                                />
                                <Rate style={{ marginLeft: '10px' }} disabled value={selectedReview?.rating} />
                            </div>

                            <Button
                                onClick={onHelpfulBtnClick}
                                variant={selectedReview?.hasLikedReview ? 'solid' : 'outlined'}
                                color='cyan'
                                style={{ padding: '1.3rem' }}
                            >
                                <LikeOutlined style={{ fontSize: 25 }} />
                                <span style={{ fontSize: 20 }}>({selectedReview?.likes})</span>
                            </Button>

                        </div>

                        {selectedReview?.imagesUrls?.length > 0 && (
                            <Card
                                title={<span><PictureOutlined style={{ marginRight: 8 }} />Images</span>}
                                size="small"
                                style={{
                                    marginTop: '1.5rem',
                                    backgroundColor: isForAdmin ? '#041529' : '#f6ffed',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                }}
                                styles={{
                                    header: {
                                        backgroundColor: isForAdmin ? '#91acfd' : '#e6fffb',
                                        fontWeight: 'bold'
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

                        <Typography.Paragraph style={{ textAlign: 'justify', marginTop: '1rem' }}>
                            {selectedReview.content}
                        </Typography.Paragraph>
                    </>
                )}
            </Modal>
        </>
    );
};

export default ReviewsList;