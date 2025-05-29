import { useContext } from 'react';

import { Modal, Typography, Form, Input, Space, Divider } from 'antd';

import {
    ExclamationCircleOutlined,
    DeleteOutlined,
    WarningOutlined,
    BellOutlined,
    // ArrowUndoOutlined,
} from '@ant-design/icons';

import { reviewsServiceFactory } from '../../../services/reviewsService';

import { AuthContext } from '../../../contexts/AuthContext';

import { useNavigate } from 'react-router-dom';

import { fireError } from '../../../utils/fireError';

const { TextArea } = Input;

const DeleteReviewModal = ({ reviewId, reviewUserId, visible, setVisible, isReviewApproved }) => {

    const navigate = useNavigate();

    const { token, userId } = useContext(AuthContext);

    const reviewService = reviewsServiceFactory(token);

    const [form] = Form.useForm();

    const handleOk = () => {

        form.validateFields()
            .then(values => {

                const payload = {
                    reviewId,
                    ...values
                };

                reviewService
                    .deleteReview(payload)
                    .then(res => {
                        navigate('/admin', { state: { successOperation: { message: res.successMessage } } });
                    }).catch(err => {
                        fireError(err);
                    })

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
            title="Delete Review"
            open={visible}
            okText="Delete"
            okType="danger"
            onOk={handleOk}
            onCancel={handleCancel}
        >

            <Space direction="vertical" size={6} style={{ display: 'flex' }}>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                    <Space size={6}>
                        <DeleteOutlined style={{ color: '#ff4d4f' }} />
                        Are you sure you want to delete this review?
                    </Space>
                </Typography.Paragraph>

                <Space size={6}>
                    <WarningOutlined style={{ color: '#ff4d4f' }} />
                    <Typography.Text type="danger" strong>
                        This action will mark the review as deleted.
                    </Typography.Text>
                </Space>

                {isReviewApproved && reviewUserId !== userId && (
                    <Space size={6}>
                        <BellOutlined style={{ color: '#faad14' }} />
                        <Typography.Text type="danger" style={{ lineHeight: 1.4 }}>
                            The reviewer will <Typography.Text strong>lose points</Typography.Text> and <Typography.Text strong>receive a notification</Typography.Text>.
                        </Typography.Text>
                    </Space>
                )}

                {isReviewApproved && reviewUserId === userId && (
                    <Space size={6}>
                        <WarningOutlined style={{ color: '#ff4d4f' }} />
                        <Typography.Text type="danger" style={{ lineHeight: 1.4 }}>
                            You will <Typography.Text strong>lose points</Typography.Text>.
                        </Typography.Text>
                    </Space>
                )}

                {!isReviewApproved && reviewUserId !== userId && (
                    <Space size={6}>
                        <BellOutlined style={{ color: '#faad14' }} />
                        <Typography.Text type="danger" style={{ lineHeight: 1.4 }}>
                            The reviewer will <Typography.Text strong>receive a notification</Typography.Text>.
                        </Typography.Text>
                    </Space>
                )}

                <Divider style={{ margin: '6px 0' }} />

                <Space size={6}>
                    <Typography.Text type="secondary" strong>
                        You will have a limited time to undo this action.
                    </Typography.Text>
                </Space>
            </Space>


            <Form style={{ marginTop: '1rem' }} form={form} layout="vertical">
                {reviewUserId !== userId && (
                    <Form.Item
                        name="reason"
                        label="Reason for Delete"
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
                        />
                    </Form.Item>
                )}
            </Form>

        </Modal>
    );
};

export default DeleteReviewModal;
