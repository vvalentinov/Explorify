import { Card, Form, Input, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import { homePath } from '../../../constants/paths';

import { usersServiceFactory } from '../../../services/usersService';

import { fireError } from '../../../utils/fireError';

import { useEffect, useState } from 'react';

const ResetPassword = () => {

    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");
        const email = queryParams.get("email");

        if (token) {
            setToken(token);
        }

        if (email) {
            setEmail(email);
        }

        const url = new URL(window.location);
        url.searchParams.delete("token");
        url.searchParams.delete("email");
        window.history.replaceState({}, '', url);
    }, []);

    const navigate = useNavigate();

    const usersService = usersServiceFactory();

    const handleFinish = (data) => {

        data.Email = email;
        data.Token = token;

        usersService
            .resetPassword(data)
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
            minHeight: 'calc(100vh - 221px)',
        }}>
            <Card
                title={<><SettingOutlined /> Reset your password here</>}
                style={{ width: '60%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                styles={{ header: { fontSize: '1.4rem' } }}
            >

                <Form layout="vertical" onFinish={handleFinish}>

                    <Form.Item
                        label="New Password"
                        name="Password"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input.Password
                            allowClear={true}
                            style={{ fontSize: '18px' }}
                            size='large'
                            placeholder="Enter your new password here"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="ConfirmPassword"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input.Password
                            allowClear={true}
                            style={{ fontSize: '18px' }}
                            size='large'
                            placeholder="Confirm your password here"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button
                            size='large'
                            variant='solid'
                            color='cyan'
                            htmlType="submit"
                            block
                        >
                            Reset Password
                        </Button>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    )
};

export default ResetPassword;