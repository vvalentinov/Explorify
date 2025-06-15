import { useContext, useEffect } from 'react';
import { Modal, Form, Input, App } from 'antd';

import { AuthContext } from '../../../contexts/AuthContext';

import { fireError } from '../../../utils/fireError';

import { usersServiceFactory } from '../../../services/usersService';

const ChangeUserNameModal = ({ visible, setVisible }) => {

    const { message } = App.useApp();

    const { token, userName, auth, setAuth } = useContext(AuthContext);

    const usersService = usersServiceFactory(token);

    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            form.setFieldsValue({ UserName: userName });
        }
    }, [visible, userName, form]);

    const handleOk = () => {

        form
            .validateFields()
            .then(values => {
                usersService
                    .changeUserName(values)
                    .then(res => {
                        message.success(res.successMessage || "Username changed successfully!");

                        const updatedAuth = { ...auth, userName: values.UserName };

                        setAuth(updatedAuth);

                        setVisible(false);
                        // form.resetFields();
                    })
                    .catch(err => fireError(err));
            })
            .catch(errorInfo => {
                console.log('Validation failed:', errorInfo);
            });

    };

    const handleCancel = () => {
        setVisible(false);
        // form.resetFields();
    };

    return (
        <Modal
            centered
            title={<span style={{ fontSize: '2rem' }}>Change Username</span>}
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
                    backgroundColor: '#13c2c2'
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

            <Form
                form={form}
                layout="vertical"
                initialValues={{ UserName: userName }}
            >

                <Form.Item
                    name="UserName"
                    label={<span style={{ fontSize: '1.5rem' }}>Username</span>}
                    rules={[
                        {
                            required: true,
                            message: 'You must provide username.'
                        },
                        {
                            type: 'string',
                            min: 3,
                            max: 30,
                            message: 'Username must be between 3 and 30 characters long.'
                        }
                    ]}
                >

                    <Input
                        maxLength={30}
                        placeholder="Enter your cool username here..."
                        style={{ fontSize: '1.5rem' }}
                    />

                </Form.Item>

            </Form>
        </Modal>
    );
};

export default ChangeUserNameModal;
