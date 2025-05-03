import { Card, Form, Input, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import { homePath } from '../../constants/paths';

import { usersServiceFactory } from '../../services/usersService';

import { fireError } from '../../utils/fireError';

const ForgotPassword = () => {

    const navigate = useNavigate();

    const usersService = usersServiceFactory();

    const handleFinish = (data) => {

        usersService
            .forgotPassword(data)
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
                title={<><SettingOutlined /> Forgot your password, huh? It happens.</>}
                style={{ width: '60%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                styles={{ header: { fontSize: '1.4rem' } }}
            >

                <Form layout="vertical" onFinish={handleFinish}>

                    <Form.Item
                        label="Email"
                        name="Email"
                        rules={[
                            {
                                type: "email",
                                required: true,
                            },
                        ]}
                    >
                        <Input allowClear={true}
                            style={{ fontSize: '18px' }}
                            size='large'
                            placeholder="Enter your email here"
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
                            Send Me An Email
                        </Button>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    )
};

export default ForgotPassword;