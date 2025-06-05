import styles from './SignIn.module.css';

import { LockOutlined, UserOutlined, LoginOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography, Card, ConfigProvider, Image } from "antd";


import { useContext, useState } from 'react';
import { NavLink, useNavigate, Link } from "react-router-dom";

import { AuthContext } from '../../../contexts/AuthContext';
import { signUpPath, homePath, forgotPasswordPath } from '../../../constants/paths';
import { authServiceFactory } from '../../../services/authService';

import myImage from '../../../assets/image.png';
import logoImage from '../../../assets/logo.png';

const { Text, Title, Paragraph } = Typography;

import { motion } from 'framer-motion';

const AnimatedEmoji = () => (
    <motion.span
        style={{
            display: 'inline-block',
            cursor: 'pointer',
            fontSize: '3rem',
            borderRadius: '8px',
            padding: '0.2rem',
            outline: 'none',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            backgroundColor: 'transparent'
        }}
        whileHover={{
            scale: 1.2,
            rotate: 10,
            transition: { type: 'spring', stiffness: 200, damping: 12 }
        }}
        whileTap={{
            scale: [1, 0.8, 1],
            rotate: 0,
            transition: { duration: 0.3, ease: 'easeInOut' }
        }}
        aria-label="Globe emoji"
        role="img"
        onMouseDown={(e) => e.preventDefault()}
        onFocus={(e) => e.target.blur()}
    >
        🌍
    </motion.span>
);



const SignIn = () => {
    const navigate = useNavigate();

    const authService = authServiceFactory();

    const { userLogin } = useContext(AuthContext);

    const [isSigningIn, setIsSigningIn] = useState(false);

    const onFinish = (values) => {
        setIsSigningIn(true);

        authService
            .login(values)
            .then(res => {
                userLogin(res);
                setIsSigningIn(false);
                navigate(homePath, { state: { username: res.userName } });
            }).catch(err => {
                console.log(err);
                setIsSigningIn(false);
            });
    };

    return (
        <section className={styles.signInSection}>

            <div className={styles.signInBackground} />

            <div className={styles.wrapper}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        ease: [0.25, 0.8, 0.25, 1],
                        type: 'spring',
                        stiffness: 120,
                        damping: 20,
                    }}
                    className={styles.cardWrapper}
                >
                    <Card styles={
                        {
                            header: {
                                border: 'none'
                            }
                        }
                    }
                        className={styles.signInCard}
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <LoginOutlined style={{ fontSize: '2.5rem', color: '#00684a' }} />
                                <span style={{ fontSize: '2.2rem', fontWeight: 600, color: '#00684a' }}>Sign In</span>
                            </div>
                        }
                    >

                        <Form
                            name="normal_login"
                            onFinish={onFinish}
                            layout="vertical"
                        >
                            <Form.Item
                                name="username"
                                layout='vertical'
                                label={<span style={{ fontSize: '1.5rem' }}>Username</span>}
                                style={{ marginBottom: '2.5rem' }}
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
                                label={<span style={{ fontSize: '1.5rem' }}>Password</span>}
                                style={{ marginBottom: '2.5rem' }}
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
                                    prefix={<LockOutlined />}
                                    type="password"
                                    placeholder="Some strong password here..."
                                />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: "0px" }}>

                                <Button
                                    variant='solid'
                                    size='large'
                                    block="true"
                                    htmlType="submit"
                                >
                                    {isSigningIn ? 'Signing you in...' : 'Sign In'}
                                </Button>

                                <div className={styles.footer}>
                                    <Link to={signUpPath}>Don't have an account?</Link>
                                    <Link to={forgotPasswordPath}>Forgot Password?</Link>
                                </div>

                            </Form.Item>

                        </Form>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.5,
                        ease: [0.25, 0.8, 0.25, 1],
                        type: 'spring',
                        stiffness: 80,
                        damping: 18,
                        delay: 0.1
                    }}
                    className={styles.textContainerWrapper}
                >
                    <div className={styles.textContainer}>
                        <Typography.Title level={3} className={styles.title}>Reconnect with the World</Typography.Title>
                        <Typography.Paragraph className={styles.description}>
                            Sign in to continue your journey with Explorify — a place where memories meet discovery.
                            <br /><br />
                            Dive back into your favorite travel moments, uncover hidden gems across the globe, and share experiences that inspire others. Your passport to adventure starts here.
                        </Typography.Paragraph>
                    </div>
                </motion.div>
            </div>

        </section>
    )
};

export default SignIn;