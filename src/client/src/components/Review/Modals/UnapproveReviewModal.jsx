import { useState, useContext } from 'react';
import { Modal, Typography, Form, Input, message, Space } from 'antd';

import {
    ExclamationCircleOutlined,
    CloseCircleOutlined,
    BellOutlined,
    WarningOutlined
} from '@ant-design/icons';

import { adminServiceFactory } from '../../../services/adminService';
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { fireError } from '../../../utils/fireError';

const { TextArea } = Input;

const UnapproveReviewModal = ({
    reviewId,
    reviewUserId,
    visible,
    setVisible
}) => {

    const navigate = useNavigate();

    const { token, userId } = useContext(AuthContext);

    const adminService = adminServiceFactory(token);

    const [form] = Form.useForm();

    const handleOk = () => {

        form.validateFields()
            .then(values => {

                const payload = {
                    reviewId,
                    ...values
                };

                adminService
                    .unapproveReview(payload)
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
            title="Unapprove Place"
            open={visible}
            okText="Unapprove"
            okType="danger"
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Space direction="vertical" size={6} style={{ display: 'flex' }}>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                    <Space size={6}>
                        <CloseCircleOutlined style={{ color: '#fa541c' }} />
                        Are you sure you want to unapprove this review?
                    </Space>
                </Typography.Paragraph>

                <Space size={6}>
                    <WarningOutlined style={{ color: '#ff4d4f' }} />
                    <Typography.Text type="danger" strong>
                        This action will mark the review as not approved.
                    </Typography.Text>
                </Space>

                {userId !== reviewUserId && (
                    <Space size={6}>
                        <BellOutlined style={{ color: '#faad14' }} />
                        <Typography.Text type="danger" style={{ lineHeight: 1.4 }}>
                            The reviewer will <Typography.Text strong>lose points</Typography.Text> and <Typography.Text strong>receive a notification</Typography.Text>.
                        </Typography.Text>
                    </Space>
                )}

                {userId === reviewUserId && (
                    <Space size={6}>
                        <WarningOutlined style={{ color: '#ff4d4f' }} />
                        <Text type="danger" style={{ lineHeight: 1.4 }}>
                            You will <Text strong>lose points</Text>.
                        </Text>
                    </Space>
                )}
            </Space>


            <Form style={{ marginTop: '1rem' }} form={form} layout="vertical">
                {reviewUserId != userId &&
                    <Form.Item
                        name="reason"
                        label="Reason for Unapproval"
                        rules={[
                            {
                                required: true,
                                message: 'Please provide a reason.'
                            },
                            {
                                type: 'string',
                                min: 5,
                                max: 200,
                                message: 'Reason must be between 5 and 200 characters.'
                            }
                        ]}
                    >
                        <TextArea
                            rows={4}
                            maxLength={200}
                            minLength={5}
                            placeholder="Explain why this review is being unapproved..."
                        />
                    </Form.Item>}
            </Form>
        </Modal>
    );
};

export default UnapproveReviewModal;