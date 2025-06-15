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
    Spin,
    ConfigProvider,
    Empty
} from "antd";

import { motion } from "framer-motion";
import { fireError } from '../../utils/fireError';

import Pagination from '../Pagination/Pagination';

import { NotificationContext } from '../../contexts/NotificationContext';

const Notifications = () => {
    const { token } = useContext(AuthContext);
    const { notificationCount } = useContext(NotificationContext);

    const { message } = App.useApp();

    const notificationsService = notificationsServiceFactory(token);

    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const [shouldScroll, setShouldScroll] = useState(false);
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [notificationsCount, setNotificationsCount] = useState(0);

    const containerVariants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    };

    const bellVariants = {
        animate: {
            rotate: [0, -10, 10, -6, 6, -3, 3, 0],
            transition: {
                duration: 1,
                repeat: Infinity,
                repeatDelay: 4,
            },
        },
    };

    useLayoutEffect(() => {
        if (shouldScroll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShouldScroll(false);
        }
    }, [shouldScroll]);

    const fetchNotifications = (page = currentPage) => {
        setSpinnerLoading(true);
        setShouldScroll(true);

        notificationsService
            .getNotifications(page)
            .then(res => {
                setNotifications(res.notifications);
                setNotificationsCount(res.pagination.recordsCount);
                setPagesCount(res.pagination.pagesCount);
                setSpinnerLoading(false);
            }).catch(err => fireError(err));
    };


    useEffect(() => {
        fetchNotifications();
    }, [currentPage]);


    const handlePageChange = (page) => setCurrentPage(page);

    const markNotificationAsRead = (id) => {
        notificationsService
            .markNotificationAsRead(id)
            .then(res => {
                message.success(res.successMessage, 5);
                fetchNotifications(currentPage);
            })
            .catch(err => fireError(err));
    };

    const deleteNotification = (id) => {
        notificationsService
            .delete(id)
            .then(res => {
                message.success(res.successMessage, 5);
                setCurrentPage(1);
                fetchNotifications(1);
            })
            .catch(err => fireError(err));
    };


    const markAllAsRead = () => {
        notificationsService
            .markAllAsRead()
            .then(res => {
                message.success(res.successMessage || "All notifications marked as read", 5);
                setCurrentPage(1);
                fetchNotifications(1);
            }).catch(err => fireError(err));
    };

    const deleteAll = () => {
        notificationsService
            .deleteAll()
            .then(res => {
                message.success(res.successMessage, 5);
                setCurrentPage(1);
                fetchNotifications(1);
            }).catch(err => {
                fireError(err)
            });
    }

    return (


        <section className={styles.notificationsSection}>

            <div className={styles.notificationsContainer}>

                {notifications?.length > 0 && !spinnerLoading && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8.5rem' }}>

                        <Typography.Title level={3} className={styles.pageTitle}>
                            <motion.span variants={bellVariants} animate="animate" style={{ display: 'inline-block' }}>
                                <BellOutlined />
                            </motion.span>
                            {" "}New Notifications ({notificationCount})
                        </Typography.Title>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            <Button onClick={markAllAsRead} variant='solid' color='cyan' className={styles.notificationsButton}>Mark all as read</Button>
                            <Button onClick={deleteAll} variant='solid' color='danger' className={styles.notificationsButton}>Delete All</Button>
                        </div>
                    </div>
                )}

                {
                    spinnerLoading ?
                        (
                            <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'green' } } }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    // border: 'solid 1px red',
                                    minHeight: '600px'
                                }}>

                                    <Spin
                                        className={styles.spinner}
                                        size='large'
                                        spinning={spinnerLoading}
                                    />
                                </div>
                            </ConfigProvider>
                        ) : notificationsCount > 0 ?
                            <>
                                <motion.div
                                    className={styles.notificationsList}
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                >
                                    {notifications.map((notification) => (
                                        <motion.div style={{ width: '80%' }} key={notification.id} variants={cardVariants}>
                                            <Card className={`${styles.notificationCard} ${notification.isRead ? styles.notificationRead : styles.notificationUnread}`}>
                                                <div className={styles.cardContent}>
                                                    <div className={styles.cardText}>
                                                        <Typography.Text className={styles.cardTitle}>
                                                            {notification.content}
                                                        </Typography.Text>
                                                        <Typography.Text
                                                            type="secondary"
                                                            className={styles.cardDate}
                                                        >
                                                            {new Date(notification.createdOn).toLocaleString()}
                                                        </Typography.Text>
                                                    </div>

                                                    <div className={styles.cardActions}>
                                                        {!notification.isRead && (
                                                            <Popover content="Mark as read">
                                                                <Button
                                                                    icon={<CheckOutlined />}
                                                                    variant="solid"
                                                                    color="green"
                                                                    onClick={() => markNotificationAsRead(notification.id)}
                                                                    style={{
                                                                        color: "black",
                                                                        fontSize: "1.5rem",
                                                                        borderRadius: "50%",
                                                                        padding: "1.3rem",
                                                                    }}
                                                                />
                                                            </Popover>
                                                        )}
                                                        <Popover content="Delete notification">
                                                            <Button
                                                                icon={<DeleteOutlined />}
                                                                variant="solid"
                                                                color="danger"
                                                                danger
                                                                style={{
                                                                    color: "black",
                                                                    fontSize: "1.5rem",
                                                                    borderRadius: "50%",
                                                                    padding: "1.3rem",
                                                                }}
                                                                onClick={() => deleteNotification(notification.id)}
                                                            />
                                                        </Popover>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </motion.div>


                                {pagesCount > 1 && <Pagination
                                    currentPage={currentPage}
                                    handlePageChange={handlePageChange}
                                    isForAdmin={false}
                                    pagesCount={pagesCount}
                                />}
                            </>
                            :
                            <Empty
                                style={{
                                    minHeight: '600px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    margin: '0'
                                }}
                                description={
                                    <span style={{ fontSize: '2rem', fontWeight: 500, fontFamily: 'Poppins, Segoe UI, sans-serif', }}>
                                        No notifications yet
                                    </span>
                                }
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                }

            </div>

        </section>
    );
};

export default Notifications;
