import { message, notification } from 'antd';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {

    const location = useLocation();

    const [messageApi, messageContextHolder] = message.useMessage();
    const [api, notificationContextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, message, description) => {
        api[type]({ message, description });
    };

    useEffect(() => {
        if (location.state?.username) {
            messageApi.success(`Hello, ${location.state.username}! 👋`);
            window.history.replaceState({}, '');
        }

        if (location.state?.successOperation) {
            const message = location.state?.successOperation?.message;
            openNotificationWithIcon('success', message);
            window.history.replaceState({}, '');
        }

        const searchParams = new URLSearchParams(location.search);

        if (searchParams.get("emailConfirmed") === "true") {
            openNotificationWithIcon(
                'success',
                'Email Confirmed',
                'Your email has been successfully confirmed.'
            );
            const url = new URL(window.location);
            url.searchParams.delete("emailConfirmed");
            window.history.replaceState({}, '', url);
        } else if (searchParams.get("emailConfirmed") === "false") {
            openNotificationWithIcon(
                'error',
                'Error',
                'Error with confirming your email!'
            );
            const url = new URL(window.location);
            url.searchParams.delete("emailConfirmed");
            window.history.replaceState({}, '', url);
        }

        if (searchParams.get("emailChanged") === "true") {
            openNotificationWithIcon(
                'success',
                'Email Changes',
                'Your email has been successfully changed.'
            );
            const url = new URL(window.location);
            url.searchParams.delete("emailChanged");
            window.history.replaceState({}, '', url);
        } else if (searchParams.get("emailChanged") === "false") {
            openNotificationWithIcon(
                'error',
                'Error',
                'Error with changing your email!'
            );
            const url = new URL(window.location);
            url.searchParams.delete("emailChanged");
            window.history.replaceState({}, '', url);
        }

    }, [location.state]);

    return (
        <>
            {messageContextHolder}
            {notificationContextHolder}
            <h2>This is the home page!</h2>
        </>
    );
};

export default Home;