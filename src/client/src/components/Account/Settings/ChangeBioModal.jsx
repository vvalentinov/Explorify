import { useState, useContext } from 'react';
import { Modal, Typography, Form, Input, App } from 'antd';


import { AuthContext } from '../../../contexts/AuthContext';

import { useNavigate } from 'react-router-dom';

import { fireError } from '../../../utils/fireError';

import { usersServiceFactory } from '../../../services/usersService';

const { TextArea } = Input;

const ChangeBioModal = ({ visible, setVisible, userBio }) => {

    const { message } = App.useApp();

    const navigate = useNavigate();

    const { token, userId } = useContext(AuthContext);

    const usersService = usersServiceFactory(token);

    const [form] = Form.useForm();

    const handleOk = () => {

        form
            .validateFields()
            .then(values => {
                usersService
                    .changeBio(values)
                    .then(res => { message.success(res.successMessage) })
                    .catch(err => fireError(err));

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
            title={<span style={{ fontSize: '2rem' }}>Change Bio</span>}
            open={visible}
            okText="Change"
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

            <Form form={form} layout="vertical" initialValues={{ Bio: userBio }}>

                <Form.Item
                    name="Bio"
                    label={<span style={{ fontSize: '1.5rem' }}>Bio</span>}
                    rules={[
                        {
                            required: true,
                            message: 'You must provide bio.'
                        },
                        {
                            type: 'string',
                            min: 15,
                            max: 350,
                            message: 'Bio must be between 15 and 350 characters.'
                        }
                    ]}
                >
                    <TextArea
                        rows={4}
                        maxLength={350}
                        minLength={15}
                        placeholder="Enter your cool bio here..."
                        style={{ fontSize: '1.5rem' }}
                    />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default ChangeBioModal;
