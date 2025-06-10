import styles from './ReviewEdit.module.css';

import { reviewsServiceFactory } from '../../../services/reviewsService';

import { useState, useEffect, useContext } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../contexts/AuthContext';

import { fireError } from '../../../utils/fireError';

import ImageUpload from '../../Place/UploadPlace/ImageUpload/ImageUpload';

import { generateFormData } from './editReviewUtil';

import { EditOutlined } from '@ant-design/icons';

import {
    Input,
    Rate,
    Form,
    Typography,
    ConfigProvider,
    Spin,
    Button
} from 'antd';

const { TextArea } = Input;

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

            <div className={styles.editReviewCard}>

                <Typography.Title level={3} className={styles.pageTitle}><EditOutlined /> Edit Review</Typography.Title>

                <Form layout="vertical" form={form} onFinish={onSubmit}>

                    <Form.Item
                        style={{
                            background: '#e8faef',
                            padding: '2rem 4rem',
                            borderRadius: '16px',
                            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06)',
                            margin: '0 auto',
                            width: 'fit-content',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.Rating !== curr.Rating}>
                                {({ getFieldValue }) => {
                                    const rating = getFieldValue('Rating');
                                    return rating ? (
                                        <Typography.Text
                                            style={{
                                                background: '#f6ffed',
                                                color: '#389e0d',
                                                fontSize: '1.5rem',
                                                fontWeight: 600,
                                                padding: '6px 16px',
                                                borderRadius: '12px',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                                marginBottom: '1rem',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {['😖', '😞', '😐', '🙂', '🤩'][rating - 1]}{' '}
                                            {['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'][rating - 1]}
                                        </Typography.Text>
                                    ) : null;
                                }}
                            </Form.Item>

                            <Form.Item
                                name="Rating"
                                rules={[{ required: true, message: 'Please provide a rating.' }]}
                                noStyle
                            >
                                <Rate allowClear={false}
                                    style={{ fontSize: '3rem' }}
                                    tooltips={['Terrible', 'Bad', 'Okay', 'Good', 'Excellent']}
                                />
                            </Form.Item>
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="Content"
                        rules={[
                            { required: true, message: 'Please write your review.' },
                            { max: 1000, message: 'Review must be under 1000 characters.' }
                        ]}
                        style={{ width: '100%', margin: '4rem 0' }}
                        label={<span style={{ fontSize: '1.5rem' }}>Content</span>}
                    >
                        <TextArea style={{ fontSize: '1.5rem', padding: '2rem' }} maxLength={1000} rows={10} placeholder="Write your review here..." />
                    </Form.Item>

                    <ImageUpload setToBeRemovedImagesIds={setToBeRemovedImagesIds} />

                    <Button
                        block
                        size="large"
                        variant='solid'
                        color='cyan'
                        htmlType="submit"
                        className={styles.editButton}
                    >
                        {
                            isEditing ?
                                <span>
                                    Editing...
                                    <ConfigProvider theme={{
                                        components: {
                                            Spin: {
                                                colorPrimary: '#fff'
                                            }
                                        }
                                    }}>
                                        <Spin style={{ marginLeft: '10px' }} spinning={true} />
                                    </ConfigProvider>
                                </span> :
                                'Edit'
                        }
                    </Button>

                </Form>
            </div>
        </div>
    )
};

export default ReviewEdit;