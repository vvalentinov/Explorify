import { useContext } from 'react';
import { Modal, Typography, Form, Input, Space } from 'antd';

import {
    CloseCircleOutlined,
    BellOutlined,
    WarningOutlined
} from '@ant-design/icons';

import { adminServiceFactory } from '../../../services/adminService';
import { AuthContext } from '../../../contexts/AuthContext';

import { fireError } from '../../../utils/fireError';

const { TextArea } = Input;

const UnapproveReviewModal = ({
    reviewId,
    reviewUserId,
    visible,
    setVisible,
    onUnapproveSuccess
}) => {

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
                        setVisible(false);
                        form.resetFields();
                        onUnapproveSuccess?.(res.successMessage);
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
            centered
            title={<span style={{ fontSize: '2rem' }}>Unapprove Review</span>}
            open={visible}
            okText="Unapprove"
            okType="danger"
            onOk={handleOk}
            onCancel={handleCancel}
            width={800}
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
                        <CloseCircleOutlined style={{ color: '#fa541c' }} />
                        Are you sure you want to unapprove this review?
                    </Space>
                </Typography.Paragraph>

                <Typography.Text style={{ marginBottom: 0, fontSize: '1.7rem' }}>
                    <Space size={6}>
                        <WarningOutlined style={{ color: '#ff4d4f' }} />
                        This action will mark the review as not approved.
                    </Space>
                </Typography.Text>

                {userId !== reviewUserId && (
                    <Typography.Text style={{ marginBottom: 0, fontSize: '1.7rem' }}>
                        <Space size={6}>
                            <BellOutlined style={{ color: '#faad14' }} />
                            The reviewer will lose points and receive a notification.
                        </Space>
                    </Typography.Text>
                )}

                {userId === reviewUserId && (
                    <Typography.Text style={{ marginBottom: 0, fontSize: '1.7rem' }}>
                        <Space size={6}>
                            <WarningOutlined style={{ color: '#ff4d4f' }} />
                            You will lose points.
                        </Space>
                    </Typography.Text>
                )}
            </Space>


            <Form style={{ marginTop: '1rem' }} form={form} layout="vertical">
                {reviewUserId != userId &&
                    <Form.Item
                        name="reason"
                        label={<span style={{ fontSize: '1.5rem' }}>Reason for Unapproval</span>}
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
                            style={{ fontSize: '1.5rem' }}
                        />
                    </Form.Item>}
            </Form>
        </Modal>
    );
};

export default UnapproveReviewModal;