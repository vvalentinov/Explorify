import styles from './PlaceDetails.module.css';

import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import { placesServiceFactory } from "../../services/placesService";
import { reviewsServiceFactory } from '../../services/reviewsService';

import { fireError } from "../../utils/fireError";

import { UserOutlined, UploadOutlined } from '@ant-design/icons';

import {
    Carousel,
    Card,
    Typography,
    Avatar,
    Rate,
    Modal,
    Button,
    Form,
    Input,
    Upload
} from 'antd';

import { AuthContext } from '../../contexts/AuthContext';

const PlaceDetails = () => {

    const { userId, token } = useContext(AuthContext);

    const placeService = placesServiceFactory();
    const reviewService = reviewsServiceFactory(token);

    const location = useLocation();

    const [place, setPlace] = useState({});

    useEffect(() => {

        if (location.state?.placeId) {
            placeService
                .getPlaceDetailsById(location.state?.placeId)
                .then(res => setPlace(res))
                .catch(err => fireError(err));
        }

    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const [fileList, setFileList] = useState([]);

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList.slice(-5));
    };

    const handleReviewSubmit = (values) => {

        const formData = new FormData();

        formData.append("Rating", values.Rating ?? "");
        formData.append("Content", values.Content);
        formData.append("PlaceId", place.id);

        fileList.forEach(file => {
            if (file.originFileObj) { formData.append("Files", file.originFileObj); }
        });

        reviewService
            .uploadReview(formData)
            .then(res => console.log(res))
            .catch(err => fireError(err));

        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <>
            {place && (
                <>
                    <section className={styles.placeDetailsCardSection}>
                        <Card
                            styles={{
                                header: {
                                    // borderBottom: 'solid 1px black',
                                    backgroundColor: '#e8fffb'
                                }
                            }}
                            title={
                                <div className={styles.cardHeader}>
                                    <Avatar icon={<UserOutlined />} src={place.userProfileImageUrl} size={40} />
                                    <div style={{
                                        // border: 'solid 1px black',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        marginLeft: '1rem'
                                    }}
                                    >
                                        <span className={styles.placeTitle}>{place.name}</span>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            fontStyle: 'italic',
                                        }}
                                        >
                                            uploaded by: {place.userName}</span>
                                    </div>

                                </div>
                            }
                            className={styles.placeDetailsCard}
                        >
                            {place.imagesUrls?.length > 0 && (
                                <div className={styles.carouselWrapperStyle}>
                                    <Carousel
                                        arrows
                                        dots
                                        // autoplay
                                        infinite
                                        style={{ borderRadius: '10px' }}
                                    >
                                        {place.imagesUrls.map((x, i) => (
                                            <div key={i}>
                                                <img className={styles.imageStyle} src={x} alt={`Slide ${i}`} />
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>
                            )}

                            <Card
                                styles={{
                                    header: {
                                        // borderBottom: 'solid 1px black',
                                        backgroundColor: '#e8fffb'
                                    },
                                    body: {
                                        // backgroundColor: '#f5f7fa'
                                    }
                                }}
                                title="Description"
                                className={styles.placeDescriptionCard}
                            >
                                <Typography.Paragraph className={styles.placeDescriptionParagraph}>
                                    {place.description}
                                </Typography.Paragraph>
                            </Card>

                        </Card>

                        <Card
                            styles={{
                                header: {
                                    // borderBottom: 'solid 1px black',
                                    backgroundColor: '#e8fffb'
                                }
                            }}
                            className={styles.userReviewCard}
                            title={
                                <div className={styles.reviewCardHeader}>
                                    <div className={styles.reviewCardHeaderContainer}>
                                        <Avatar src={place.userProfileImageUrl} size={40} />
                                        <span className={styles.placeTitle}>{place.userName}</span>
                                    </div>
                                    <div>
                                        <Rate style={{ padding: '0', margin: '0' }} disabled value={place.userReviewRating} />
                                    </div>
                                </div>
                            }
                        >
                            <Typography.Paragraph className={styles.placeDescriptionParagraph}>
                                {place.userReviewContent}
                            </Typography.Paragraph>

                        </Card>

                    </section>

                    {/* {place.userId != userId && (
                        <section className={styles.reviewsSection}>
                            <Card
                                className={styles.uploadReviewCard}
                                style={{
                                    background: '#e8fffb',
                                    border: '1px solid green',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography.Title level={4}>What did you think of this place?</Typography.Title>
                                <Typography.Paragraph>
                                    Share your experience and help others explore with confidence!
                                </Typography.Paragraph>

                                <Button color='cyan' variant='solid' size='large' onClick={handleOpenModal}>Write a Review</Button>
                            </Card>
                        </section>
                    )} */}

                    <section className={styles.reviewsSection}>
                        <Card
                            className={styles.uploadReviewCard}
                            style={{
                                background: '#e8fffb',
                                border: '1px solid green',
                                borderRadius: '12px',
                                textAlign: 'center',
                            }}
                        >
                            <Typography.Title level={4}>What did you think of this place?</Typography.Title>
                            <Typography.Paragraph>
                                Share your experience and help others explore with confidence!
                            </Typography.Paragraph>

                            <Button color='cyan' variant='solid' size='large' onClick={handleOpenModal}>Write a Review</Button>
                        </Card>
                    </section>

                    <Modal
                        title="Write Your Review"
                        open={isModalOpen}
                        onCancel={handleCloseModal}
                        footer={null}
                        width={700}
                        style={{ top: 20 }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleReviewSubmit}
                        >
                            <Card
                                style={{
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: '#e8fffb',
                                    borderRadius: '12px',
                                    border: '1px solid green',
                                    marginTop: '1rem',
                                }}
                                title={
                                    <span>
                                        Upload Images
                                    </span>
                                }
                            >
                                <Form.Item
                                    style={{
                                        border: '1px dashed #91d5ff',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Upload
                                        listType="picture"
                                        fileList={fileList}
                                        onChange={handleFileChange}
                                        beforeUpload={() => false}
                                        multiple
                                        maxCount={5}
                                    >
                                        <Button
                                            color='cyan'
                                            variant='solid'
                                            size='large'
                                            icon={<UploadOutlined />}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                fontWeight: 500,
                                            }}
                                        >
                                            Select Up To 5 Images
                                        </Button>
                                    </Upload>
                                </Form.Item>
                            </Card>


                            <Card style={{
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#e8fffb',
                                borderRadius: '12px',
                                border: '1px solid green',
                                margin: '2rem 0',
                            }}>

                                <Form.Item
                                    name="Rating"
                                    label="Rating"
                                    rules={[{ required: true }]}
                                >
                                    <Rate />
                                </Form.Item>

                                <Form.Item
                                    name="Content"
                                    label="Content"
                                    rules={[{ required: true }]}
                                >
                                    <Input.TextArea showCount={true} rows={4} placeholder="Share your thoughts..." />
                                </Form.Item>

                            </Card>

                            <Form.Item>
                                <Button
                                    color='cyan'
                                    variant='solid'
                                    size='large'
                                    htmlType="submit"
                                    block
                                >
                                    Submit Review
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )}
        </>
    )
};

export default PlaceDetails;