import { useState, useContext } from 'react';
import { Modal, Typography, Form, Input, message } from 'antd';

import { adminServiceFactory } from '../../../../services/adminService';

import { AuthContext } from '../../../../contexts/AuthContext';

import { useNavigate } from 'react-router-dom';

import { fireError } from '../../../../utils/fireError';

const { TextArea } = Input;

const UnapprovePlaceModal = ({ placeId, visible, setVisible }) => {

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const adminService = adminServiceFactory(token);

    // const [visible, setVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form] = Form.useForm();

    const handleOk = () => {

        form.validateFields()
            .then(values => {

                const payload = {
                    placeId,
                    ...values
                };

                adminService
                    .unapprovePlace(payload)
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
            confirmLoading={submitting}
            onCancel={handleCancel}
        >
            <Typography.Paragraph>
                Are you sure you want to unapprove this place?
                <div>
                    <Typography.Text type="danger" strong>
                        This action will mark the place as not approved.
                    </Typography.Text>
                </div>
                <div>
                    <Typography.Text type="danger" strong>
                        The user who uploaded it will lose points and receive notification.
                    </Typography.Text>
                </div>
            </Typography.Paragraph>


            <Form form={form} layout="vertical">
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
                        placeholder="Explain why this place is being unapproved..."
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UnapprovePlaceModal;
