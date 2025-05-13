import * as signalR from '@microsoft/signalr';

import { useContext, createContext, useEffect, useState } from 'react';

import { AuthContext } from './AuthContext';

import { baseUrl } from '../constants/baseUrl';

import { App } from 'antd';

export const NotificationContext = createContext();

import { notificationsServiceFactory } from '../services/notificationService';

export const NotificationProvider = ({ children }) => {

    const { notification } = App.useApp();

    const { token, isAuthenticated } = useContext(AuthContext);

    const notificationService = notificationsServiceFactory(token);

    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {

        if (!isAuthenticated || !token) return;

        notificationService
            .getUnreadNotificationsCount()
            .then(res => setNotificationCount(res))
            .catch(err => console.log(err));

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/hubs/notification`, { accessTokenFactory: () => token })
            .withAutomaticReconnect()
            .build();

        connection
            .start()
            .then(() => {

                console.log('SignalR Connected');

                connection.on('Notify', (message) => {
                    notification.info({ message: 'Notification', description: message });
                });

                connection.on('IncreaseNotificationsCount', () => setNotificationCount((prev) => prev + 1));
                connection.on('ReduceNotificationsCount', () => setNotificationCount((prev) => Math.max(prev - 1, 0)));

            }).catch((err) => console.error('SignalR Connection Error: ', err));

        return () => {
            connection.stop();
        };

    }, [isAuthenticated, token]);

    return (
        <NotificationContext.Provider
            value={{
                notificationCount,
                setNotificationCount,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
