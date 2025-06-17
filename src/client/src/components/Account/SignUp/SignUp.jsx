import styles from './SignUp.module.css';

import { useContext, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

import { LockOutlined, UserOutlined, MailOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography, Card } from "antd";

import { homePath, signInPath } from '../../../constants/paths';
import { authServiceFactory } from '../../../services/authService';

import { AuthContext } from '../../../contexts/AuthContext';

import { motion } from 'framer-motion';

import { fireError } from '../../../utils/fireError';

const SignUp = () => {
    const navigate = useNavigate();

    const authService = authServiceFactory();

    const { userLogin } = useContext(AuthContext);

    const [isSigningUp, setIsSigningUp] = useState(false);

    const onFinish = (data) => {

        setIsSigningUp(true);


        authService
            .register(data)
            .then(res => {
                userLogin(res);
                setIsSigningUp(false);
                navigate(homePath, { state: { username: res.userName } });
            }).catch(err => {
                fireError(err);
                setIsSigningUp(false);
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
                                <UserAddOutlined style={{ fontSize: '2.5rem', color: '#00684a' }} />
                                <span style={{ fontSize: '2.2rem', fontWeight: 600, color: '#00684a' }}>Sign Up</span>
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
                                // style={{ marginBottom: '2.5rem' }}
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
                                name="email"
                                label={<span style={{ fontSize: '1.5rem' }}>Email</span>}
                                rules={[
                                    {
                                        type: "email",
                                        required: true,
                                    },
                                ]}
                            >
                                <Input
                                    size='large'
                                    prefix={<MailOutlined />}
                                    placeholder="Email"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                layout="vertical"
                                label={<span style={{ fontSize: '1.5rem' }}>Password</span>}
                                style={{ marginBottom: '2rem' }}
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
                                    {isSigningUp ? 'Signing you up...' : 'Sign Up'}
                                </Button>

                                <div className={styles.footer}>
                                    <Link style={{ color: '#00aed7', fontStyle: 'italic' }} to={signInPath}>Already have an account?</Link>
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
                        <Typography.Title level={3} className={styles.title}>
                            Join Explorify
                        </Typography.Title>
                        <Typography.Paragraph className={styles.description}>
                            Create your free account and become part of a passionate community of explorers.
                            <br /><br />
                            Share your favorite destinations, discover hidden gems from other travelers, and connect with people who love to explore the world just like you. Your next adventure begins the moment you sign up.
                        </Typography.Paragraph>
                    </div>
                </motion.div>
            </div>

        </section>
    )
};

export default SignUp;