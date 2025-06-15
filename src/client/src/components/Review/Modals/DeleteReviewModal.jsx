import { useContext } from 'react';

import { Modal, Typography, Form, Input, Space, Divider } from 'antd';
import { DeleteOutlined, WarningOutlined, BellOutlined } from '@ant-design/icons';

import { reviewsServiceFactory } from '../../../services/reviewsService';

import { AuthContext } from '../../../contexts/AuthContext';

import { useNavigate } from 'react-router-dom';

import { fireError } from '../../../utils/fireError';

const { TextArea } = Input;

const DeleteReviewModal = ({
    reviewId,
    reviewUserId,
    visible,
    setVisible,
    isReviewApproved,
    isForAdmin
}) => {

    const navigate = useNavigate();

    const { token, userId } = useContext(AuthContext);

    const reviewService = reviewsServiceFactory(token);

    const [form] = Form.useForm();

    const handleOk = () => {

        form.validateFields()
            .then(values => {

                const payload = { reviewId, ...values };

                reviewService
                    .deleteReview(payload)
                    .then(res => {
                        navigate(isForAdmin ? '/admin' : '/', { state: { successOperation: { message: res.successMessage } } });
                    }).catch(err => {
                        fireError(err);
                    });

            })
            .catch(errorInfo => {
                console.log('Validation failed:', errorInfo);
            });
    };

    const handleCancel = () => {
        setVisible(false);
        form.resetFields();
    };

    return (
        <Modal
            centered
            title={<span style={{ fontSize: '2rem' }}>Delete Review</span>}
            open={visible}
            okText="Delete"
            okType="danger"
            onOk={handleOk}
            width={800}
            onCancel={handleCancel}
            okButtonProps={{
                style: {
                    height: '48px',
                    fontSize: '1.5rem',
                    padding: '0 2rem',
                    fontWeight: 600,
                },
            }}
            cancelButtonProps={{
                style: {
                    height: '48px',
                    fontSize: '1.5rem',
                    padding: '0 2rem',
                    fontWeight: 600,
                },
            }}
        >

            <Space direction="vertical" size={6} style={{ display: 'flex' }}>

                <Typography.Paragraph style={{ marginBottom: 0, fontSize: '1.7rem' }}>
                    <Space size={6}>
                        <DeleteOutlined style={{ color: '#ff4d4f' }} />
                        Are you sure you want to delete this review?
                    </Space>
                </Typography.Paragraph>

                <Typography.Paragraph style={{ marginBottom: 0, fontSize: '1.7rem' }}>
                    <Space size={6}>
                        <WarningOutlined style={{ color: '#ff4d4f' }} />
                        This action will mark the review as deleted.
                    </Space>
                </Typography.Paragraph>

                {isReviewApproved && reviewUserId !== userId && (
                    <Typography.Paragraph style={{ marginBottom: 0, fontSize: '1.7rem' }}>
                        <Space size={6}>
                            <BellOutlined style={{ color: '#faad14' }} />
                            The reviewer will lose points and receive a notification.
                        </Space>
                    </Typography.Paragraph>
                )}

                {isReviewApproved && reviewUserId === userId && (
                    <Typography.Paragraph style={{ marginBottom: 0, fontSize: '1.7rem' }}>
                        <Space size={6}>
                            <WarningOutlined style={{ color: '#ff4d4f' }} />
                            You will lose points.
                        </Space>
                    </Typography.Paragraph>
                )}

                {!isReviewApproved && reviewUserId !== userId && (
                    <Typography.Paragraph style={{ marginBottom: 0, fontSize: '1.7rem' }}>
                        <Space size={6}>
                            <BellOutlined style={{ color: '#faad14' }} />
                            The reviewer will receive a notification.
                        </Space>
                    </Typography.Paragraph>
                )}

                <Divider style={{ margin: '6px 0' }} />

                <Typography.Paragraph style={{ marginBottom: 0, fontSize: '1.3rem', fontStyle: 'italic' }}>
                    You will have a limited time to undo this action.
                </Typography.Paragraph>
            </Space>


            <Form style={{ marginTop: '1rem' }} form={form} layout="vertical">
                {reviewUserId !== userId && (
                    <Form.Item
                        name="reason"
                        label={<span style={{ fontSize: '1.5rem' }}>Reason for Delete</span>}
                        rules={[
                            {
                                required: true,
                                message: 'Please provide a reason.',
                            },
                            {
                                type: 'string',
                                min: 5,
                                max: 200,
                                message: 'Reason must be between 5 and 200 characters.',
                            },
                        ]}
                    >
                        <TextArea
                            rows={4}
                            maxLength={200}
                            minLength={5}
                            placeholder="Explain why this review is being deleted..."
                            style={{ fontSize: '1.5rem' }}
                        />
                    </Form.Item>
                )}
            </Form>

        </Modal>
    );
};

export default DeleteReviewModal;
