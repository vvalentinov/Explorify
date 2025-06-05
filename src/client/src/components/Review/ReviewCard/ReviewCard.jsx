import styles from './ReviewCard.module.css';

import {
    UserOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    StopOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';

import {
    Card,
    Typography,
    Avatar,
    Rate,
    Button
} from 'antd';

import { useNavigate } from 'react-router-dom';

const ReviewCard = ({
    review,
    isForPlace,
    isForUser,
    isForAdmin,
    handleOpenModal,
    handleDelete,
    handleRevert,
    handleUnapprove,
    approveReviewModal
}) => {

    const navigate = useNavigate();

    return (
        <Card
            key={review.id}
            hoverable={isForPlace}
            onClick={() => isForPlace ? handleOpenModal(review) : undefined}
            style={{
                overflow: 'hidden',
                borderRadius: '16px',
                border: '1px solid #eaeaea',
                marginBottom: '1.5rem',
                boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
                cursor: isForPlace ? 'pointer' : 'default',
            }}
            className={styles.reviewCard}
            styles={{
                body: {
                    padding: '1.25rem 1.5rem'
                }
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                {/* User Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Avatar
                        src={review.profileImageUrl || undefined}
                        size={60}
                        icon={!review.profileImageUrl && <UserOutlined />}
                    />
                    <div>
                        <Typography.Text strong style={{ fontSize: '25px' }}>{review.userName}</Typography.Text>
                        <br />
                        <Typography.Text type="secondary" style={{ fontSize: '18px' }}>
                            {new Date(review.createdOn).toLocaleDateString()}
                        </Typography.Text>
                    </div>
                </div>

                {/* Rating */}
                <Rate disabled value={review.rating} style={{ fontSize: '25px' }} />
            </div>

            {/* Review Content */}
            <Typography.Paragraph
                style={{ fontSize: 20, lineHeight: 1.6, textAlign: 'justify', marginBottom: '1rem' }}
                ellipsis={{ rows: isForPlace ? 10 : 5 }}
            >
                {review.content}
            </Typography.Paragraph>

            {/* Action Buttons */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginTop: '0.5rem'
            }}>
                {/* Viewer (admin/user) */}
                {!isForPlace && (
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleOpenModal(review)}
                        variant='solid'
                        color='cyan'
                        block
                        size='large'
                        style={{ fontSize: '1.4rem' }}
                    >
                        Open
                    </Button>
                )}

                {/* User Controls */}
                {isForUser && !review.isDeleted && (
                    <>
                        <Button
                            icon={<EditOutlined />}
                            variant='solid'
                            color='gold'
                            onClick={() => navigate('/review/edit', { state: { reviewId: review.id } })}
                            block
                            style={{ fontSize: '1.4rem' }} size='large'
                        >
                            Edit
                        </Button>
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleDelete(review)}
                            block
                            style={{ fontSize: '1.4rem' }} size='large'
                            variant='solid'
                            color='danger'
                        >
                            Delete
                        </Button>
                    </>
                )}

                {isForUser && review.isDeleted && !review.isDeletedByAdmin && (
                    <Button size='large' style={{ fontSize: '1.4rem' }} block type="primary" onClick={() => handleRevert(review.id)}>
                        Revert
                    </Button>
                )}

                {/* Admin Controls */}
                {isForAdmin && (
                    <>
                        {review.isDeleted ? (
                            <Button
                                size='large'
                                style={{ fontSize: '1.4rem' }}
                                block
                                type="primary"
                                onClick={() => handleRevert(review.id)}
                            >
                                Revert
                            </Button>
                        ) : review.isApproved ? (
                            <>
                                <Button
                                    size='large'
                                    style={{ fontSize: '1.4rem' }}
                                    block
                                    onClick={() => handleUnapprove(review)}
                                    variant='solid'
                                    color='gold'
                                    icon={<StopOutlined />}
                                >
                                    Unapprove
                                </Button>
                                <Button
                                    icon={<DeleteOutlined />}
                                    size='large'
                                    style={{ fontSize: '1.4rem' }}
                                    block
                                    danger
                                    onClick={() => handleDelete(review)}
                                    variant='solid'
                                    color='danger'
                                >
                                    Delete
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    size='large'
                                    icon={<CheckCircleOutlined />}
                                    style={{ fontSize: '1.4rem' }}
                                    block
                                    type="primary"
                                    onClick={() => approveReviewModal(review)}
                                >
                                    Approve
                                </Button>
                                <Button
                                    icon={<DeleteOutlined />}
                                    size='large'
                                    style={{ fontSize: '1.4rem' }}
                                    block
                                    danger
                                    onClick={() => handleDelete(review)}
                                    variant='solid'
                                    color='danger'
                                >
                                    Delete
                                </Button>
                            </>
                        )}
                    </>
                )}
            </div>
        </Card>
    );
};

export default ReviewCard;