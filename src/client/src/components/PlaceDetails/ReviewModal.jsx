import {
    Card,
    Typography,
    Avatar,
    Rate,
    Button,
    Modal,
    Image,
} from 'antd';

import {
    LikeOutlined,
    PictureOutlined,
} from '@ant-design/icons';

const ReviewModal = ({
    setReviews,
    reviewsService,
    selectedReview,
    isReviewModalOpen,
    setSelectedReview,
    setIsReviewModalOpen,
}) => {

    const onHelpfulBtnClick = () => {

        const updatedReview = { ...selectedReview };

        const updateBothStates = (res, liked) => {
            updatedReview.likes = res.likes;
            updatedReview.user.hasLikedReview = liked;

            setSelectedReview(updatedReview);
            setReviews(prev => prev.map(r => r.id === updatedReview.id ? updatedReview : r));
        };

        if (selectedReview?.user?.hasLikedReview) {
            reviewsService
                .dislikeReview(selectedReview.id)
                .then(res => updateBothStates(res, false))
                .catch(err => console.log(err));
        } else {
            reviewsService
                .likeReview(selectedReview.id)
                .then(res => updateBothStates(res, true))
                .catch(err => console.log(err));
        }

    };

    return (
        <Modal
            open={isReviewModalOpen}
            onCancel={() => setIsReviewModalOpen(false)}
            footer={null}
            title={` ${selectedReview?.user?.userName}'s review`}
            style={{ top: 30 }}
            styles={{ header: { fontStyle: 'italic' } }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={selectedReview?.user?.profileImageUrl} size={48} />
                    <Rate style={{ marginLeft: '10px' }} disabled value={selectedReview?.rating} />
                </div>

                <Button
                    onClick={onHelpfulBtnClick}
                    variant={selectedReview?.user?.hasLikedReview ? 'solid' : 'outlined'}
                    color='cyan'>
                    Helpful ({selectedReview?.likes}) <LikeOutlined />
                </Button>

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

            <Typography.Paragraph style={{
                textAlign: 'justify',
                marginTop: '1rem'
            }}>
                {selectedReview?.content}
            </Typography.Paragraph>

        </Modal>
    );
};

export default ReviewModal;