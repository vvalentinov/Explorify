import styles from './ChangeUsername.module.css';

import { Card, Form, Input, Button, Typography, message } from 'antd';
import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import { homePath } from '../../constants/paths';

import { usersServiceFactory } from '../../services/usersService';

import { useContext } from 'react';

import { AuthContext } from '../../contexts/AuthContext';

import { fireError } from '../../utils/fireError';

const ChangeUsername = () => {

    const { token } = useContext(AuthContext);

    const navigate = useNavigate();

    const usersService = usersServiceFactory(token);

    const handleFinish = (data) => {

        usersService
            .changeUserName(data)
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
                title={<><UserOutlined /> Change Your Username</>}
                style={{ width: '60%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                styles={{ header: { fontSize: '1.4rem' } }}
            >
                <Typography.Paragraph style={{ fontSize: '1.1rem', textAlign: 'center', marginBottom: 24 }}>
                    ✨ Time for a fresh start? Pick a new username below!
                </Typography.Paragraph>

                <Form layout="vertical" onFinish={handleFinish}>

                    <Form.Item
                        label="New Username"
                        name="UserName"
                        rules={[{ required: true }, { min: 2 }, { max: 50 }]}
                    >
                        <Input size='large' placeholder="Enter your new username" />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button
                            size='large'
                            variant='solid'
                            color='cyan'
                            htmlType="submit" block
                        >
                            Change Username
                        </Button>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    )
};

export default ChangeUsername;