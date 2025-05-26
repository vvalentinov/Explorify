import { useContext } from 'react';
import { Modal, Typography, Form, Input } from 'antd';

import { reviewsServiceFactory } from '../../../../services/reviewsService';

import { AuthContext } from '../../../../contexts/AuthContext';

import { useNavigate } from 'react-router-dom';

import { fireError } from '../../../../utils/fireError';

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
            <Typography.Paragraph>
                Are you sure you want to delete this review?
                <div>
                    <Typography.Text type="danger" strong>
                        This action will mark the review as deleted.
                    </Typography.Text>
                </div>

                {isReviewApproved && reviewUserId !== userId &&
                    <div>
                        <Typography.Text type="danger" strong>
                            The user who uploaded it will lose points and receive notification.
                        </Typography.Text>
                    </div>
                }

                {isReviewApproved && reviewUserId === userId &&
                    <div>
                        <Typography.Text type="danger" strong>
                            You will lose points.
                        </Typography.Text>
                    </div>
                }

                {!isReviewApproved && reviewUserId !== userId &&
                    <div>
                        <Typography.Text type="danger" strong>
                            The user who uploaded it will receive notification.
                        </Typography.Text>
                    </div>
                }

                <div>
                    <Typography.Text type="secondary" strong>
                        You will have a time window in which you can revert it back.
                    </Typography.Text>
                </div>
            </Typography.Paragraph>

            <Form form={form} layout="vertical">
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
