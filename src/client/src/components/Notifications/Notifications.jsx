import { useState, useEffect, useContext, useLayoutEffect } from "react";

import { notificationsServiceFactory } from "../../services/notificationService";

import { AuthContext } from "../../contexts/AuthContext";

import { BellOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { Card, Typography, Button, App, Popover, Tag, Pagination, Spin, ConfigProvider } from "antd";

const { Title, Text } = Typography;

const Notifications = () => {

    const { token } = useContext(AuthContext);

    const { message } = App.useApp();

    const notificationsService = notificationsServiceFactory(token);

    const [notifications, setNotifications] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(0);

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

        const MIN_SPINNER_TIME = 1000;
        const startTime = Date.now();

        notificationsService
            .getNotifications(currentPage)
            .then(res => {

                const elapsed = Date.now() - startTime;
                const remaining = MIN_SPINNER_TIME - elapsed;

                setTimeout(() => {
                    setNotifications(res.notifications);
                    setNotificationsCount(res.recordsCount);
                    setPagesCount(res.pagesCount);
                    setSpinnerLoading(false);

                }, remaining > 0 ? remaining : 0);

            }).catch(err => console.log(err));

    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const markAsRead = (id) => {
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
            }).catch(err => console.log(err));
    }

    return (
        <div
            style={{
                padding: "2rem",
                maxWidth: "800px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            <Title
                level={2}
                style={{
                    textAlign: "center",
                    background: "#f6ffed",
                    border: "1px solid #b7eb8f",
                    color: "#389e0d",
                    padding: "1rem 2rem",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    display: "inline-flex", // or 'inline-block' for a similar effect
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginBottom: "2rem",
                }}
            >
                <BellOutlined style={{ fontSize: "1.5rem" }} />
                Notifications ({notificationsCount})
            </Title>

            {
                spinnerLoading ?
                    <ConfigProvider theme={{
                        components: {
                            Spin: {
                                colorPrimary: 'green'
                            }
                        }
                    }}>
                        <Spin size='large' spinning={spinnerLoading} />
                    </ConfigProvider> :
                    <div

                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            paddingRight: "0.5rem",
                        }}
                    >
                        {notifications.length === 0 ? (
                            <Text type="secondary" style={{ textAlign: "center" }}>
                                No notifications yet.
                            </Text>
                        ) : (
                            notifications.map((notif, index) => (

                                <Card
                                    key={index}
                                    style={{
                                        position: "relative",
                                        padding: "1.5rem",
                                        borderLeft: "4px solid #52c41a",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                                        borderRadius: "12px",
                                        marginBottom: "1rem",
                                        backgroundColor: notif.isRead ? "#f9f9f9" : "#ffffff",
                                    }}
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
                                            <Popover placement="right" content='Mark as read'>
                                                <Button
                                                    shape="circle"
                                                    icon={<CheckOutlined />}
                                                    onClick={() => markAsRead(notif.id)}
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

            {!spinnerLoading && pagesCount > 1 && <Pagination
                align='center'
                onChange={handlePageChange}
                current={currentPage}
                total={pagesCount * 6}
                pageSize={6}
                style={{ textAlign: 'center', marginTop: '2rem' }}
            />}

        </div>
    );
};

export default Notifications;