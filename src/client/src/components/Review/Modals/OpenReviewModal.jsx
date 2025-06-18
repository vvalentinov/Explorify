import {
    Typography,
    Avatar,
    Rate,
    Button,
    Modal,
    Image
} from 'antd';

import { UserOutlined, LikeOutlined } from '@ant-design/icons';

import styles from './OpenReviewModal.module.css';

import { AuthContext } from '../../../contexts/AuthContext';

import { useContext } from 'react';

const OpenReviewModal = ({
    isModalOpen,
    handleCloseModal,
    selectedReview,
    onHelpfulBtnClick,
    isForAdmin,
    isForUser,
    isForFollowedUser
}) => {

    const { userId, isAuthenticated } = useContext(AuthContext);

    const displayHelpfulBtn = !isForAdmin && !isForUser && !isForFollowedUser && isAuthenticated && selectedReview?.userId !== userId;

    console.log(selectedReview?.likes);

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCloseModal}
            footer={null}
            width={1000}
            centered
            className={isForAdmin ? 'adminModal' : ''}
        >
            {selectedReview && (
                <div className={`${styles.modalBody} ${isForAdmin ? styles.adminModalBody : styles.publicModalBody}`}>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            rowGap: '1rem',
                            marginBottom: '1.5rem',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <Avatar
                                src={selectedReview?.profileImageUrl || undefined}
                                size={80}
                                icon={!selectedReview?.profileImageUrl && <UserOutlined />}
                            />
                            <div>
                                <Typography.Text strong style={{ fontSize: '1.5rem', color: isForAdmin ? 'white' : '#333' }}>
                                    {selectedReview.userName}
                                </Typography.Text>
                                <br />
                                <Typography.Text type="secondary" style={{ fontSize: '1.2rem', color: isForAdmin ? '#ccc' : '#666' }}>
                                    {new Date(selectedReview.createdOn).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </Typography.Text>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>

                            {isForFollowedUser && selectedReview?.likes !== undefined && (
                                <div className={styles.likesDisplay}>
                                    <LikeOutlined className={styles.likesIcon} />
                                    <div className={styles.likesTextGroup}>
                                        <span className={styles.likesCount}>{selectedReview.likes}</span>
                                    </div>
                                </div>
                            )}


                            {displayHelpfulBtn && (
                                <Button
                                    color="cyan"
                                    onClick={onHelpfulBtnClick}
                                    variant={selectedReview?.hasLikedReview ? 'solid' : 'outlined'}
                                    style={{ padding: '1.5rem', borderRadius: 10 }}
                                    className={styles.helpfulButton}
                                >
                                    <LikeOutlined style={{ fontSize: 32 }} />
                                    <span style={{ fontSize: 26 }}>({selectedReview?.likes})</span>
                                </Button>
                            )}
                            <div className={isForAdmin ? styles.adminRate : ''}>
                                <Rate
                                    style={{ fontSize: '2rem' }}
                                    disabled
                                    value={selectedReview?.rating}
                                />
                            </div>
                        </div>
                    </div>


                    {selectedReview?.imagesUrls?.length > 0 && (
                        <Image.PreviewGroup>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '10px',
                                    flexWrap: 'wrap',
                                    justifyContent: 'flex-start',
                                }}
                                className={styles.imageGrid}
                            >
                                {selectedReview.imagesUrls.map((url, index) => (
                                    <Image
                                        key={index}
                                        src={url}
                                        width={180}
                                        height={180}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                                            transition: 'transform 0.2s ease-in-out',
                                        }}
                                        preview
                                        className={styles.previewImage}
                                    />
                                ))}
                            </div>
                        </Image.PreviewGroup>
                    )}

                    <Typography.Paragraph
                        style={{
                            textAlign: 'justify',
                            marginTop: '1rem',
                            fontSize: '1.3rem',
                            color: isForAdmin ? 'white' : 'black'
                        }}
                    >
                        {selectedReview.content}
                    </Typography.Paragraph>
                </div>
            )}
        </Modal>
    );
};

export default OpenReviewModal;