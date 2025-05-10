import styles from './ChangePassword.module.css';

import { Card, Form, Input, Button, Typography, message } from 'antd';
import { useState } from 'react';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import { homePath } from '../../constants/paths';

import { usersServiceFactory } from '../../services/usersService';

import { useContext } from 'react';

import { AuthContext } from '../../contexts/AuthContext';

import { fireError } from '../../utils/fireError';

const ChangePassword = () => {
    const { token } = useContext(AuthContext);

    const navigate = useNavigate();

    const usersService = usersServiceFactory(token);

    const handleFinish = (data) => {

        usersService
            .changePassword(data)
            .then(res => navigate(homePath,
                {
                    state: {
                        successOperation:
                        {
                            message: res.successMessage
                        }
                    }
                })
            ).catch(err => fireError(err));
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: "center",
            minHeight: 'calc(100vh - 63px)',
        }}>
            <Card
                title={<><SettingOutlined /> Change Your Password</>}
                style={{ width: '70%', boxShadow: '0 6px 20px rgba(0, 128, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.15)', border: 'solid 1px green' }}
                styles={{ header: { fontSize: '1.4rem', borderBottom: 'solid 1px green', backgroundColor: '#eafffb' } }}
            >
                <Typography.Paragraph style={{ fontSize: '1.1rem', textAlign: 'center', marginBottom: 24 }}>
                    🔐 Password reset time! Let’s boost your security.
                </Typography.Paragraph>

                <Form layout="vertical" onFinish={handleFinish}>

                    <Form.Item
                        label="Old Password"
                        name="OldPassword"
                        rules={[{ required: true }]}
                    >
                        <Input.Password
                            style={{ fontSize: '18px' }}
                            size='large'
                            placeholder="Enter your old password here"
                        />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="NewPassword"
                        rules={[{ required: true }]}
                    >
                        <Input.Password
                            style={{ fontSize: '18px' }}
                            size='large'
                            placeholder="Enter your new password here"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button
                            size='large'
                            variant='solid'
                            color='cyan'
                            htmlType="submit" block
                        >
                            Change Password
                        </Button>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    )
};

export default ChangePassword;