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
            minHeight: 'calc(100vh - 63px)',
        }}>
            <Card
                title={<><UserOutlined /> Change Username</>}
                style={{ width: '70%', boxShadow: '0 6px 20px rgba(0, 128, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.15)', border: 'solid 1px green' }}
                styles={{ header: { fontSize: '1.4rem', borderBottom: 'solid 1px green', backgroundColor: '#eafffb' } }}
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
                        <Input size='large' placeholder="Enter your new cool username here..." />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button
                            size='large'
                            variant='solid'
                            color='cyan'
                            htmlType="submit"
                            block
                        >
                            Change
                        </Button>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    )
};

export default ChangeUsername;