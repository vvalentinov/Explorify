import {
    Card,
    Typography,
    Avatar,
    Rate,
    Button,
    Modal,
    Image
} from 'antd';

import {
    UserOutlined,
    PictureOutlined,
    LikeOutlined
} from '@ant-design/icons';

const OpenReviewModal = ({
    isModalOpen,
    handleCloseModal,
    selectedReview,
    onHelpfulBtnClick,
    isForAdmin
}) => {

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCloseModal}
            footer={null}
            width={800}
            // style={{ top: 100 }}
            styles={{
                body: {
                    padding: '1.5rem'
                }
            }}
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
                                size={80}
                                icon={!selectedReview?.profileImageUrl && <UserOutlined />}
                            />
                            <Rate style={{ marginLeft: '10px', fontSize: '2rem' }} disabled value={selectedReview?.rating} />
                        </div>

                        {!isForAdmin && (
                            <Button
                                color='cyan'
                                onClick={onHelpfulBtnClick}
                                variant={selectedReview?.hasLikedReview ? 'solid' : 'outlined'}
                                style={{ padding: '2rem', borderRadius: 10 }}
                            >
                                <LikeOutlined style={{ fontSize: 40 }} />
                                <span style={{ fontSize: 30 }}>({selectedReview?.likes})</span>
                            </Button>
                        )}

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
                                    fontWeight: 'bold',
                                    fontSize: '1.5rem',
                                    padding: '1rem 0',
                                    paddingLeft: '1.5rem'
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
                                            width={180}
                                            height={180}
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

                    <Typography.Paragraph style={{ textAlign: 'justify', marginTop: '1rem', fontSize: '1.3rem' }}>
                        {selectedReview.content}
                    </Typography.Paragraph>
                </>
            )}
        </Modal>
    );
};

export default OpenReviewModal;