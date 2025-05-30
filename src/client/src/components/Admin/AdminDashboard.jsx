import { Card, Typography } from 'antd';
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

    useEffect(() => {
        adminService
            .getDashboardInfo()
            .then(res => setDashboardInfo(res))
            .catch(err => console.log(err));
    }, []);

    const stats = {
        pendingReviews: dashboardInfo?.unapprovedReviewsNumber,
        pendingPlaces: dashboardInfo?.unapprovedPlacesNumber,
        totalUsers: dashboardInfo?.registeredUsersNumber,
    };

    const cards = [
        {
            title: 'Places Awaiting Approval',
            value: stats.pendingPlaces,
            icon: <EnvironmentOutlined />,
            description: 'New places submitted by users',
            background: '#f6ffed',
            borderColor: '#b7eb8f',
            iconColor: '#52c41a',
        },
        {
            title: 'Reviews Awaiting Approval',
            value: stats.pendingReviews,
            icon: <FileSearchOutlined />,
            description: 'New user-submitted reviews to moderate',
            background: '#fffbe6',
            borderColor: '#ffe58f',
            iconColor: '#faad14',
        },
        {
            title: 'Registered Users',
            value: stats.totalUsers,
            icon: <UserOutlined />,
            description: 'Total users on Explorify',
            background: '#e6f7ff',
            borderColor: '#91d5ff',
            iconColor: '#1890ff',
        },
    ];

    return (
        <div style={{ padding: '2rem' }}>

            <Title level={2} style={{ color: '#fff', textAlign: 'center' }}>
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
            <Paragraph style={{ color: '#fff', textAlign: 'center' }} type="secondary">
                Keep an eye on what’s happening in the app. Here’s a quick overview of items.
            </Paragraph>

            <div
                style={{
                    display: 'flex',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    marginTop: '2rem',
                    justifyContent: 'center'
                }}
            >
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: index * 0.2,
                            ease: 'easeOut'
                        }}
                        style={{
                            flex: '1 1 300px',
                            minWidth: '280px',
                            maxWidth: '360px',
                        }}
                    >
                        <Card
                            key={index}
                            title={card.title}
                            variant='borderless'
                            style={{
                                borderRadius: '16px',
                                background: card.background,
                                border: `1px solid ${card.borderColor}`,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                padding: '1rem',
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
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: card.iconColor + '20',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1rem',
                                }}
                            >
                                {React.cloneElement(card.icon, { style: { fontSize: '24px', color: card.iconColor } })}
                            </div>


                            <Title level={3} style={{ margin: '0 0 0.5rem 0' }}>
                                {card.value}
                            </Title>


                            <Paragraph type="secondary" style={{ margin: 0 }}>
                                {card.description}
                            </Paragraph>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
