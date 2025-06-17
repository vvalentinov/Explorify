import styles from './ReviewCard.module.css';

import {
    UserOutlined,
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

import { AuthContext } from '../../../contexts/AuthContext';

import { useContext } from 'react';

const ReviewCard = ({
    review,
    isForPlace,
    isForUser,
    isForAdmin,
    handleOpenModal,
    handleDelete,
    handleRevert,
    handleUnapprove,
    approveReviewModal,
    isForFollowedUser
}) => {

    const navigate = useNavigate();

    const { profileImageUrl } = useContext(AuthContext);

    return (
        <Card
            key={review.id}
            hoverable
            onClick={() => handleOpenModal(review)}
            style={{
                overflow: 'hidden',
                borderRadius: '12px',
                border: '1px solid #eaeaea',
                marginBottom: '1.5rem',
                boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
                cursor: 'pointer',
            }}
            className={`${styles.reviewCard} ${isForAdmin ? styles.adminReviewCard : ''}`}
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
                            {new Date(review.createdOn).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </Typography.Text>
                    </div>
                </div>

                {/* Rating */}
                <Rate disabled value={review.rating} style={{ fontSize: isForPlace ? '30px' : '25px' }} />
            </div>

            {/* Review Content */}
            <Typography.Paragraph
                style={{ fontSize: 20, lineHeight: 1.6, textAlign: 'justify', marginBottom: '1rem' }}
                ellipsis={{ rows: isForPlace || isForFollowedUser ? 10 : 5 }}
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

                {/* User Controls */}
                {isForUser && !review.isDeleted && (
                    <>
                        <Button
                            icon={<EditOutlined />}
                            variant='solid'
                            color='cyan'
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/review/edit', { state: { reviewId: review.id } });
                            }}
                            block
                            style={{ fontSize: '1.4rem' }} size='large'
                        >
                            Edit
                        </Button>
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(review);
                            }}
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
                    <Button
                        size='large'
                        style={{ fontSize: '1.4rem' }}
                        block
                        variant='solid'
                        color='green'
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRevert(review.id);
                        }}
                    >
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
                                variant='solid'
                                color='green'
                                onClick={(e) => { e.stopPropagation(); handleRevert(review.id); }}
                            >
                                Revert
                            </Button>
                        ) : review.isApproved ? (
                            <>
                                <Button
                                    size="large"
                                    type="default"
                                    style={{
                                        fontSize: '1.4rem',
                                        backgroundColor: '#fadb14',
                                        color: 'black',
                                        border: 'none',
                                        fontWeight: 600,
                                    }}
                                    block
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnapprove(review);
                                    }}
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
                                    onClick={(e) => { e.stopPropagation(); handleDelete(review); }}
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
                                    variant='solid'
                                    color='green'
                                    onClick={(e) => { e.stopPropagation(); approveReviewModal(review); }}
                                >
                                    Approve
                                </Button>
                                <Button
                                    icon={<DeleteOutlined />}
                                    size='large'
                                    style={{ fontSize: '1.4rem' }}
                                    block
                                    danger
                                    onClick={(e) => { e.stopPropagation(); handleDelete(review); }}
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