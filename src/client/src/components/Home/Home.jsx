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

        if (location.state?.successfullPlaceUpload) {
            openNotificationWithIcon(
                'success',
                'Successfull place upload!',
                'When an admin approves your place it will become visible on the site!');
            window.history.replaceState({}, '');
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