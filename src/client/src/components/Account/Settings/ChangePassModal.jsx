import { useContext } from 'react';
import { Modal, Form, Input, App } from 'antd';

import { AuthContext } from '../../../contexts/AuthContext';

import { fireError } from '../../../utils/fireError';

import { usersServiceFactory } from '../../../services/usersService';

const ChangePassModal = ({ visible, setVisible }) => {

    const { message } = App.useApp();

    const { token } = useContext(AuthContext);

    const usersService = usersServiceFactory(token);

    const [form] = Form.useForm();

    const handleOk = () => {

        form
            .validateFields()
            .then(values => {
                usersService
                    .changePassword(values)
                    .then(res => {
                        message.success(res.successMessage || "Password changed successfully!");
                        setVisible(false);
                        form.resetFields();
                    })
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
            title={<span style={{ fontSize: '2rem' }}>Change Password</span>}
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

            <Form form={form} layout="vertical">

                <Form.Item
                    label={<span style={{ fontSize: '1.5rem' }}>Old Password</span>}
                    name="OldPassword"
                    rules={[{ required: true }]}
                >
                    <Input.Password
                        style={{ fontSize: '25px' }}
                        size='large'
                        placeholder="Enter your old password here"
                    />
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontSize: '1.5rem' }}>New Password</span>}
                    name="NewPassword"
                    rules={[{ required: true }]}
                >
                    <Input.Password
                        style={{ fontSize: '25px' }}
                        size='large'
                        placeholder="Enter your new password here"
                    />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default ChangePassModal;
