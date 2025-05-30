import styles from './Notifications.module.css';

import { useState, useEffect, useContext, useLayoutEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { notificationsServiceFactory } from "../../services/notificationService";

import {
    BellOutlined,
    CheckOutlined,
    DeleteOutlined
} from "@ant-design/icons";

import {
    Card,
    Typography,
    Button,
    App,
    Popover,
    Tag,
    Pagination,
    Spin,
    ConfigProvider,
    Empty
} from "antd";

import { motion } from "framer-motion";
import { fireError } from '../../utils/fireError';

const { Title, Text } = Typography;

const Notifications = () => {
    const { token } = useContext(AuthContext);
    const { message } = App.useApp();

    const notificationsService = notificationsServiceFactory(token);

    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const [shouldScroll, setShouldScroll] = useState(false);
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [notificationsCount, setNotificationsCount] = useState(0);

    useLayoutEffect(() => {
        if (shouldScroll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShouldScroll(false);
        }
    }, [shouldScroll]);

    useEffect(() => {
        setSpinnerLoading(true);
        setShouldScroll(true);

        notificationsService
            .getNotifications(currentPage)
            .then(res => {
                setNotifications(res.notifications);
                setNotificationsCount(res.pagination.recordsCount);
                setPagesCount(res.pagination.pagesCount);
                setSpinnerLoading(false);
            }).catch(err => fireError(err));
    }, [currentPage]);

    const handlePageChange = (page) => setCurrentPage(page);

    const markNotificationAsRead = (id) => {
        notificationsService
            .markNotificationAsRead(id)
            .then(res => {
                message.success(res.successMessage, 5);
                setCurrentPage(1);
            }).catch(err => fireError(err));
    }

    const deleteNotification = (id) => {
        notificationsService
            .delete(id)
            .then(res => {
                message.success(res.successMessage, 5);
                setNotificationsCount(prev => Math.max(prev - 1, 0));
                setCurrentPage(1);
            }).catch(err => fireError(err));
    }

    return (
        <section className={styles.notificationsSection}>

            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <Title level={3} style={{ color: "#389e0d", fontFamily: 'Poppins, sans-serif' }}>
                    <BellOutlined style={{ marginRight: "0.5rem" }} />
                    Notifications ({notificationsCount})
                </Title>
            </div>

            {spinnerLoading ? (
                <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'green' } } }}>
                    <Spin size='large' spinning={spinnerLoading} />
                </ConfigProvider>
            ) : (
                <div className={styles.notificationsContainer}>
                    {notifications.length === 0 ? (
                        <Empty description="No notifications yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    ) : (
                        notifications.map((notif, index) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card className={`${styles.notificationCard} ${notif.isRead ? styles.read : ''}`}>
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardText}>
                                            <Text strong className={styles.cardTitle}>
                                                {notif.content}
                                            </Text>
                                            <Text type="secondary" className={styles.cardDate}>
                                                {new Date(notif.createdOn).toLocaleString()}
                                            </Text>
                                        </div>
                                        <div className={styles.cardActions}>
                                            {!notif.isRead ? (
                                                <Popover content="Mark as read">
                                                    <Button
                                                        icon={<CheckOutlined />}
                                                        type="text"
                                                        onClick={() => markNotificationAsRead(notif.id)}
                                                        style={{ color: "#52c41a" }}
                                                    />
                                                </Popover>
                                            ) : (
                                                <Tag color="green">Read</Tag>
                                            )}
                                            <Popover content="Delete notification">
                                                <Button
                                                    icon={<DeleteOutlined />}
                                                    type="text"
                                                    danger
                                                    onClick={() => deleteNotification(notif.id)}
                                                />
                                            </Popover>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {!spinnerLoading && pagesCount > 1 && (
                <ConfigProvider theme={{
                    components: {
                        Pagination: {
                            itemActiveBg: '#e8fffb',
                            itemActiveColor: '#52c41a',
                            colorPrimary: '#52c41a',
                            colorPrimaryHover: '#389e0d',
                        },
                    }
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            onChange={handlePageChange}
                            current={currentPage}
                            total={pagesCount * 6}
                            pageSize={6}
                            style={{ textAlign: 'center', marginTop: '2rem' }}
                        />
                    </div>
                </ConfigProvider>
            )}
        </section>
    );
};

export default Notifications;
