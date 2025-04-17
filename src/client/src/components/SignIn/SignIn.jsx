import styles from './SignIn.module.css';

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Grid, Input, theme, Typography, ConfigProvider } from "antd";

import { useContext } from 'react';
import { NavLink, useNavigate } from "react-router-dom";

import { AuthContext } from '../../contexts/AuthContext';
import { signUpPath, homePath } from '../../constants/paths';
import { authServiceFactory } from '../../services/authService';

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

const SignIn = () => {
    const navigate = useNavigate();

    const { token } = useToken();
    const screens = useBreakpoint();

    const authService = authServiceFactory();

    const { userLogin } = useContext(AuthContext);

    const onFinish = (values) => {
        authService
            .login(values)
            .then(res => {
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
        }}
        >
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <Title style={{ textAlign: 'center' }} level={2} className={styles.title}>Sign In</Title>
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
                                Sign In
                            </Button>
                            <div className={styles.footer}>
                                <Text className={styles.text}>Don't have an account?</Text>{" "}
                                <NavLink style={{ color: '#00aed7', fontStyle: 'italic' }} to={signUpPath}>Sign up now</NavLink>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </section>
        </ConfigProvider>
    )
};

export default SignIn;