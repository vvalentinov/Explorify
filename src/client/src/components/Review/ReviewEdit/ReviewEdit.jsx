import styles from './ReviewEdit.module.css';

import { reviewsServiceFactory } from '../../../services/reviewsService';

import { useState, useEffect, useContext } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../contexts/AuthContext';

import { fireError } from '../../../utils/fireError';

import ImageUpload from '../../Place/UploadPlace/ImageUpload/ImageUpload';

import { generateFormData } from './editReviewUtil';

import {
    EditOutlined,
    StarFilled,
    FileTextFilled
} from '@ant-design/icons';

import {
    Card,
    Input,
    Rate,
    Form,
    Typography
} from 'antd';

const { TextArea } = Input;

const desc = ['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'];

import { motion } from 'framer-motion';

const ReviewEdit = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { reviewId } = location.state || {};

    const { token } = useContext(AuthContext);

    const reviewsService = reviewsServiceFactory(token);

    const [editData, setEditData] = useState(null);
    const [toBeRemovedImagesIds, setToBeRemovedImagesIds] = useState([]);

    const [isEditing, setIsEditing] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {

        reviewsService
            .getEditInfo(reviewId)
            .then(res => {
                setEditData(res);
            }).catch(err => {
                fireError(err);
            })

    }, []);

    useEffect(() => {

        if (editData) {

            const existingImages = editData.images?.map((image, index) => ({
                uid: `existing-${image.id}`,
                name: `Image ${index + 1}`,
                status: 'done',
                url: image.url,
            }));

            form.setFieldsValue({
                Rating: editData.rating,
                Content: editData.content,
                Images: existingImages,
            });
        }

    }, [editData, form]);

    const onSubmit = (data) => {

        setIsEditing(true);

        const formData = generateFormData(data, toBeRemovedImagesIds);
        formData.append("Id", reviewId);

        reviewsService
            .edit(formData)
            .then(res => {
                navigate('/', { state: { successOperation: { message: res.successMessage } } });
                setIsEditing(false);
            }).catch(err => {
                fireError(err);
                setIsEditing(false);
            });
    }

    return (
        <div className={styles.editWrapper}>
            <Card
                title={
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                    }}>
                        <EditOutlined style={{ fontSize: 22, color: '#fff' }} />
                        <span style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#fff',
                            lineHeight: 1,
                        }}>
                            Edit Your Review
                        </span>
                    </div>
                }
                style={{
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    width: '60%'
                }}
                styles={{
                    header: {
                        // backgroundColor: '#57ae53',
                        background: 'linear-gradient(90deg, #52c41a 0%, #36cfc9 100%)'
                    }
                }}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onSubmit}
                >

                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <StarFilled style={{ fontSize: 22, color: '#fadb14' }} />
                                <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>
                                    Rating
                                </span>
                            </div>
                        }
                        styles={{
                            header: {
                                backgroundImage: 'linear-gradient(90deg, #a18cd1 0%, #fbc2eb 100%)',
                                color: '#fff',
                            },
                            body: {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        }}
                        style={{
                            marginBottom: '1.5rem',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        <Form.Item
                            name="Rating"
                            rules={[{ required: true, message: 'Please provide a rating.' }]}
                            style={{
                                background: 'violet',
                                padding: '16px 24px',
                                borderRadius: '16px',
                                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                margin: '0 auto',
                                justifyContent: 'center'
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {
                                    editData?.rating ?
                                        <Typography.Text
                                            style={{
                                                display: 'inline-block',
                                                background: '#f6ffed',
                                                color: '#389e0d',
                                                fontSize: 18,
                                                fontWeight: 600,
                                                padding: '6px 16px',
                                                borderRadius: '12px',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                                marginBottom: '1rem',
                                            }}
                                        >
                                            🌟 {desc[editData?.rating - 1]}
                                        </Typography.Text> :
                                        null}

                                <Rate
                                    value={editData?.rating}
                                    onChange={(value) => setEditData((prev) => ({ ...prev, rating: value }))}
                                    style={{ fontSize: 28 }}
                                    tooltips={desc}
                                    allowClear={false}
                                />

                            </div>

                        </Form.Item>
                    </Card>

                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <FileTextFilled style={{ fontSize: 22, color: '#fadb14' }} />
                                <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>
                                    Content
                                </span>
                            </div>
                        }
                        styles={{
                            header: {
                                backgroundImage: 'linear-gradient(90deg, #a18cd1 0%, #fbc2eb 100%)',
                                color: '#fff',
                            },
                            body: {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        }}
                        style={{
                            marginBottom: '1.5rem',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        }}
                    >

                        <Form.Item
                            name="Content"
                            rules={[
                                { required: true, message: 'Please write your review.' },
                                { max: 1000, message: 'Review must be under 1000 characters.' }
                            ]}
                            style={{ width: '100%' }}
                        >
                            <TextArea style={{ fontSize: '1.1rem' }} showCount maxLength={1000} rows={10} placeholder="Write your review here..." />
                        </Form.Item>

                    </Card>

                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <FileTextFilled style={{ fontSize: 22, color: '#fadb14' }} />
                                <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>
                                    Images
                                </span>
                            </div>
                        }
                        styles={{
                            header: {
                                backgroundImage: 'linear-gradient(90deg, #a18cd1 0%, #fbc2eb 100%)',
                                color: '#fff',
                            },
                        }}
                        style={{
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        }}
                    >

                        <ImageUpload setToBeRemovedImagesIds={setToBeRemovedImagesIds} />

                    </Card>


                    <Form.Item style={{ marginTop: '2rem' }}>
                        <motion.button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '10px 16px',
                                background: 'linear-gradient(to right, #06beb6, #48b1bf)',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: 16,
                                letterSpacing: 0.5,
                                textTransform: 'uppercase',
                                border: 'none',
                                borderRadius: '8px',
                                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                            }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ stiffness: 300, damping: 20 }}

                        >
                            {isEditing ? 'Editing Review...' : 'Edit Review'}
                        </motion.button>

                    </Form.Item>

                </Form>
            </Card>
        </div>
    )
};

export default ReviewEdit;