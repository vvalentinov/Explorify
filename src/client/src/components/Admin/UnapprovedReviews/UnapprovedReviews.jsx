import styles from './UnapprovedReviews.module.css';

import { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../../contexts/AuthContext";

import { adminServiceFactory } from "../../../services/adminService";

import { useNavigate } from 'react-router-dom';

import {
    Card,
    Typography,
    Avatar,
    Rate,
    Pagination,
    Spin,
    Radio,
    ConfigProvider,
    Image,
    Modal,
    Button,

} from 'antd';

import { PictureOutlined } from '@ant-design/icons';

const UnapprovedReviews = () => {

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const adminService = adminServiceFactory(token);

    const [reviews, setReviews] = useState([]);
    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        adminService
            .getUnapprovedReviews(currentPage)
            .then(res => {
                setReviews(res.reviews);
            }).catch(err => console.log(err));
    }, []);

    const handlePageChange = () => {

    }

    const handleCardClick = (review) => {
        setSelectedReview(review);
        setIsReviewModalOpen(true);
    };

    const handleApprove = () => {
        adminService
            .approveReview(selectedReview.id)
            .then(res => navigate('/admin'))
            .catch(err => console.log(err));
    };

    return (
        <>
            <section style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                gap: '2rem',
                flexWrap: 'wrap',
                padding: '2rem'
            }}>

                {
                    reviews.length > 0 && reviews?.map(x => (
                        <Card
                            key={x.id}
                            onClick={() => handleCardClick(x)}
                            style={{
                                width: '300px',
                                minHeight: '350px',
                                overflow: 'hidden',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.06)'
                            }}
                            styles={{
                                header: {
                                    backgroundColor: '#e8fffb',
                                }
                            }}
                            className={styles.reviewCard}
                            title={
                                <div className={styles.reviewCardHeader}>
                                    <div className={styles.reviewCardHeaderContainer}>
                                        <Avatar src={x.userProfilePicUrl} size={40} />
                                        <span style={{ marginLeft: '5px' }} className={styles.placeTitle}>{x.userName}</span>
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
                }

            </section>

            {pagesCount > 1 && <Pagination
                align='center'
                onChange={handlePageChange}
                current={currentPage}
                total={pagesCount * 6}
                pageSize={6}
                style={{ textAlign: 'center', marginTop: '2rem' }}
            />}

            <Modal
                open={isReviewModalOpen}
                onCancel={() => setIsReviewModalOpen(false)}
                footer={null}
                title={` ${selectedReview?.userName}'s review`}
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
                        <Avatar src={selectedReview?.userProfilePicUrl} size={48} />
                        <Rate style={{ marginLeft: '10px' }} disabled value={selectedReview?.rating} />
                    </div>

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

                <Button onClick={handleApprove} block>
                    Approve
                </Button>

            </Modal>
        </>
    )
};

export default UnapprovedReviews;