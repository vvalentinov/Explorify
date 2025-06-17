import { useState, useContext } from 'react';
import { Modal, Typography, Form, Input, message } from 'antd';

import { adminServiceFactory } from '../../../../services/adminService';

import { AuthContext } from '../../../../contexts/AuthContext';

import { useNavigate } from 'react-router-dom';

import { fireError } from '../../../../utils/fireError';

const { TextArea } = Input;

const UnapprovePlaceModal = ({ placeId, placeUserId, visible, setVisible }) => {

    const navigate = useNavigate();

    const { token, userId } = useContext(AuthContext);

    const adminService = adminServiceFactory(token);


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
            centered
            title={<span style={{ fontSize: '2rem' }}>Unapprove Place</span>}
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
            <Typography.Paragraph>

                <span style={{ fontSize: '1.5rem' }}>Are you sure you want to unapprove this place?</span>

                <div>
                    <Typography.Text style={{ fontSize: '1.5rem' }} type="danger" strong>
                        This action will mark the place as not approved.
                    </Typography.Text>
                </div>
                {userId != placeUserId &&
                    <div>
                        <Typography.Text style={{ fontSize: '1.5rem' }} type="danger" strong>
                            The user who uploaded it will lose points and receive notification.
                        </Typography.Text>
                    </div>
                }

                {userId == placeUserId &&
                    <div>
                        <Typography.Text style={{ fontSize: '1.5rem' }} type="danger" strong>
                            You will lose points.
                        </Typography.Text>
                    </div>
                }

            </Typography.Paragraph>


            <Form form={form} layout="vertical">
                {placeUserId != userId &&
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
                            placeholder="Explain why this place is being unapproved..."
                            style={{ fontSize: '1.5rem' }}
                        />
                    </Form.Item>}
            </Form>
        </Modal>
    );
};

export default UnapprovePlaceModal;
