import styles from './Notifications.module.css';

import { useState, useEffect, useContext, useLayoutEffect } from "react";

import { AuthContext } from "../../contexts/AuthContext";
import { notificationsServiceFactory } from "../../services/notificationService";

import {
    BellOutlined,
    CheckOutlined,
    DeleteOutlined,
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

const { Title, Text } = Typography;

const Notifications = () => {

    const { token } = useContext(AuthContext);

    const { message } = App.useApp();

    const notificationsService = notificationsServiceFactory(token);

    // State Management
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

            }).catch(err => console.log(err));

    }, [currentPage]);

    const handlePageChange = (page) => setCurrentPage(page);

    const markNotificationAsRead = (id) => {
        notificationsService
            .markNotificationAsRead(id)
            .then(res => {

                message.success(res.successMessage, 5);

                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification.id === id
                            ? { ...notification, isRead: true }
                            : notification
                    )
                );

            }).catch(err => console.log(err));
    }

    const deleteNotification = (id) => {
        notificationsService
            .delete(id)
            .then(res => {
                message.success(res.successMessage, 5);

                setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));

                setNotificationsCount(prevNotificationsCount => {
                    if (prevNotificationsCount - 1 >= 0) {
                        return prevNotificationsCount - 1;
                    }

                    return 0;
                })

            }).catch(err => console.log(err));
    }

    return (
        <section className={styles.notificationsSection}>

            <Title level={2} className={styles.notificationsTitle}>
                <BellOutlined style={{ fontSize: "1.5rem" }} />
                Notifications ({notificationsCount})
            </Title>

            {
                spinnerLoading ?

                    <ConfigProvider
                        theme={{
                            components: {
                                Spin: {
                                    colorPrimary: 'green'
                                }
                            }
                        }}>
                        <Spin size='large' spinning={spinnerLoading} />
                    </ConfigProvider> :

                    <div className={styles.notificationsContainer}>
                        {
                            notifications.length === 0 ?
                                (
                                    <Empty description="No notifications yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                ) :
                                (
                                    notifications.map((notif, index) => (

                                        <Card
                                            key={index}
                                            style={{ backgroundColor: notif.isRead ? '#f9f9f9' : '#ffffff' }}
                                            className={styles.notificationCard}
                                        >
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "1rem",
                                                    left: "1rem",
                                                }}
                                            >
                                                <Popover content="Delete notification">
                                                    <Button
                                                        shape="circle"
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => deleteNotification(notif.id)}
                                                        style={{
                                                            backgroundColor: "transparent",
                                                            borderColor: "#ff4d4f",
                                                            color: "#ff4d4f",
                                                            transition: "all 0.3s ease",
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.currentTarget.style.backgroundColor = "#ff4d4f";
                                                            e.currentTarget.style.color = "#fff";
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.currentTarget.style.backgroundColor = "transparent";
                                                            e.currentTarget.style.color = "#ff4d4f";
                                                        }}
                                                    />
                                                </Popover>
                                            </div>

                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "1rem",
                                                    right: "1rem",
                                                }}
                                            >
                                                {!notif.isRead ? (
                                                    <Popover placement="top" content='Mark as read'>
                                                        <Button
                                                            shape="circle"
                                                            icon={<CheckOutlined />}
                                                            onClick={() => markNotificationAsRead(notif.id)}
                                                            style={{
                                                                borderColor: "#52c41a",
                                                                color: "#52c41a",
                                                                backgroundColor: "transparent",
                                                                transition: "all 0.3s ease",
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.backgroundColor = "#52c41a";
                                                                e.currentTarget.style.color = "#fff";
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.backgroundColor = "transparent";
                                                                e.currentTarget.style.color = "#52c41a";
                                                            }}
                                                        />
                                                    </Popover>
                                                ) : (
                                                    <Tag color="green">Read</Tag>
                                                )}
                                            </div>

                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <Text strong style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                                                    {notif.content}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: "0.85rem" }}>
                                                    {new Date(notif.createdOn).toLocaleString()}
                                                </Text>
                                            </div>
                                        </Card>
                                    ))
                                )}
                    </div>}

            {
                !spinnerLoading &&
                pagesCount > 1 &&
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
                    <Pagination
                        align='center'
                        onChange={handlePageChange}
                        current={currentPage}
                        total={pagesCount * 6}
                        pageSize={6}
                        style={{ textAlign: 'center', marginTop: '2rem' }}
                    />
                </ConfigProvider>
            }

        </section>
    );
};

export default Notifications;