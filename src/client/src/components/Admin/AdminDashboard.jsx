import styles from './AdminDashboard.module.css';

import { Card, Typography, Spin } from 'antd';

import {
    UserOutlined,
    FileSearchOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';

import React from 'react';

const { Title, Paragraph } = Typography;

import { useEffect, useContext, useState } from 'react';

import { AuthContext } from '../../contexts/AuthContext';

import { adminServiceFactory } from '../../services/adminService';

import { motion } from 'framer-motion';

const AdminDashboard = () => {

    const { token } = useContext(AuthContext);

    const adminService = adminServiceFactory(token);

    const [dashboardInfo, setDashboardInfo] = useState({});

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService
            .getDashboardInfo()
            .then(res => setDashboardInfo(res))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    const stats = {
        pendingReviews: dashboardInfo?.unapprovedReviewsNumber,
        pendingPlaces: dashboardInfo?.unapprovedPlacesNumber,
        totalUsers: dashboardInfo?.registeredUsersNumber,
    };

    const cards = [
        {
            title: <span style={{ fontSize: '1.5rem' }}>Places Awaiting Approval</span>,
            value: stats.pendingPlaces,
            icon: <EnvironmentOutlined />,
            description: <span style={{ fontSize: '1.3rem' }}>New places submitted by users</span>,
            background: '#f6ffed',
            borderColor: '#b7eb8f',
            iconColor: '#52c41a',
        },
        {
            title: <span style={{ fontSize: '1.5rem' }}>Reviews Awaiting Approval</span>,
            value: stats.pendingReviews,
            icon: <FileSearchOutlined />,
            description: <span style={{ fontSize: '1.3rem' }}>New user-submitted reviews to moderate</span>,
            background: '#fffbe6',
            borderColor: '#ffe58f',
            iconColor: '#faad14',
        },
        {
            title: <span style={{ fontSize: '1.5rem' }}>Registered Users</span>,
            value: stats.totalUsers,
            icon: <UserOutlined />,
            description: <span style={{ fontSize: '1.5rem' }}>Total users on Explorify</span>,
            background: '#e6f7ff',
            borderColor: '#91d5ff',
            iconColor: '#1890ff',
        },
    ];


    return (
        <section className={styles.dashboardSection}>

            <div className={styles.dashboardContainer}>

                <Title level={1} className={styles.dashboardTitle}>
                    Welcome to the Admin Dashboard
                    <motion.span
                        animate={{ rotate: [0, 20, -10, 20, -5, 10, 0] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatDelay: 4,
                            ease: 'easeInOut',
                        }}
                        style={{ display: 'inline-block', originX: 0.7, originY: 0.7 }}
                    >
                        👋
                    </motion.span>
                </Title>

                <Paragraph className={styles.dashboardParagraph} type="secondary">
                    Keep an eye on what’s happening in the app. Here’s a quick overview of items.
                </Paragraph>

                <div
                    style={{
                        display: 'flex',
                        gap: '30px',
                        flexWrap: 'wrap',
                        marginTop: '2rem',
                        justifyContent: 'center',
                    }}
                >
                    {cards.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title}
                            variant='borderless'
                            style={{
                                borderRadius: '16px',
                                background: card.background,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                padding: '2rem',
                                flexBasis: '30%',
                            }}
                            styles={{
                                header: {
                                    fontSize: '1.1rem',
                                    background: 'transparent',
                                    borderBottom: 'none',
                                }
                            }}
                        >

                            <div
                                style={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    background: card.iconColor + '20',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                {React.cloneElement(card.icon, { style: { fontSize: '32px', color: card.iconColor } })}
                            </div>

                            <Title level={3} style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                                {loading ? (
                                    <span style={{ display: 'inline-block', height: '32px', width: '40px' }}>
                                        <Spin style={{ color: 'black' }} size="large" />
                                    </span>
                                ) : (
                                    card.value
                                )}
                            </Title>

                            <Paragraph type="secondary" style={{ margin: 0 }}>
                                {card.description}
                            </Paragraph>

                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;
