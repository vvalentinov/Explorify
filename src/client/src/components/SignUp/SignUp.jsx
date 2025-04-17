import styles from './SignUp.module.css';

import { useContext } from 'react';
import { NavLink, useNavigate } from "react-router-dom";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Grid, Input, theme, Typography, ConfigProvider, Anchor } from "antd";

import { signInPath, homePath } from '../../constants/paths';
import { authServiceFactory } from '../../services/authService';

import { AuthContext } from '../../contexts/AuthContext';

const { Text, Title } = Typography;

const SignUp = () => {
    const navigate = useNavigate();

    const authService = authServiceFactory();

    const { userLogin } = useContext(AuthContext);

    const onFinish = (values) => {
        authService
            .register(values)
            .then(res => {
                console.log(res);
                userLogin(res);
                navigate(homePath);
            }).catch(err => console.log(err));
    };

    return (
        <ConfigProvider theme={{
            components: {
                Input: {
                    activeShadow: '#13c2c2',
                    colorPrimary: '#13c2c2',
                    hoverBorderColor: '#13c2c2'
                }
            }
        }}>
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <Title level={2} style={{ textAlign: 'center' }}>Sign Up</Title>
                    </div>
                    <Form
                        name="normal_login"
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark="optional"
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    type: "string",
                                    required: true,
                                    message: "Please input your Username!",
                                },
                            ]}
                        >
                            <Input
                                size='large'
                                style={{ fontSize: '18px' }}
                                prefix={<UserOutlined />}
                                placeholder="Username"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Password!",
                                },
                            ]}
                        >
                            <Input.Password size='large' style={{ fontSize: '18px' }}
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: "0px" }}>
                            <Button color='cyan' variant='solid' size='large' block="true" htmlType="submit">
                                Sign Up
                            </Button>
                            <div className={styles.footer}>
                                <Text className={styles.text}>Already have an account?</Text>{" "}
                                <NavLink style={{ color: '#00aed7', fontStyle: 'italic' }} to={signInPath}>Sign in</NavLink>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </section>
        </ConfigProvider>
    )
};

export default SignUp;