import styles from './SignIn.module.css';

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography, ConfigProvider, Image } from "antd";

import { useContext } from 'react';
import { NavLink, useNavigate } from "react-router-dom";

import { AuthContext } from '../../contexts/AuthContext';
import { signUpPath, homePath } from '../../constants/paths';
import { authServiceFactory } from '../../services/authService';

import myImage from '../../assets/image.png';
import logoImage from '../../assets/logo.png';

const { Text, Title, Paragraph } = Typography;

const SignIn = () => {
    const navigate = useNavigate();

    const authService = authServiceFactory();

    const { userLogin } = useContext(AuthContext);

    const onFinish = (values) => {
        authService
            .login(values)
            .then(res => {
                userLogin(res);
                navigate(homePath, { state: { username: res.userName } });
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

                        <div style={{ display: "flex", justifyContent: 'center' }}>
                            <Image preview={false} src={logoImage} height={'60px'} width={'60px'} />
                        </div>


                        <Title
                            style={{ textAlign: 'center' }}
                            level={2}
                            className={styles.title}>
                            Sign In
                        </Title>
                        <Paragraph style={{ fontStyle: 'italic', textAlign: 'center' }}>
                            Welcome back to Explorify!
                        </Paragraph>
                        <Paragraph style={{ fontStyle: 'italic', textAlign: 'center' }}>
                            Please enter your details below to sign in.
                        </Paragraph>
                    </div>
                    <Form
                        name="normal_login"
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="username"
                            layout='vertical'
                            label='Username'
                            style={{ marginBottom: '30px' }}
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
                                prefix={<UserOutlined />}
                                placeholder="Some cool username here..."
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            layout="vertical"
                            label="Password"
                            style={{ marginBottom: '30px' }}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Password!",
                                },
                                {
                                    min: 6,
                                    message: "Password must be at least 6 characters long!"
                                }
                            ]}
                        >
                            <Input.Password
                                size='large'
                                // style={{ fontSize: '18px' }}
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="Some strong password here..."
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
                <div className={styles.imageContainer}>
                    <Image
                        preview={false}
                        width={'100%'}
                        height={'calc(100vh - 64px)'}
                        src={myImage}
                    />
                </div>
            </section>
        </ConfigProvider>
    )
};

export default SignIn;