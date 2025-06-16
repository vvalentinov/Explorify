import { App } from 'antd';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Alert = () => {

    const location = useLocation();

    const { message, notification } = App.useApp();

    useEffect(() => {

        // Check for username in location state
        if (location.state?.username) {
            message.success(`Hello, ${location.state.username}! 👋`);
            window.history.replaceState({}, '');
        }

        // Check for success operation in location state
        if (location.state?.successOperation) {
            const successMessage = location.state.successOperation.message;
            notification.success({ message: 'Success', description: successMessage, duration: 0 });
            window.history.replaceState({}, '');
        }

        if (location.state?.errorMessage) {
            notification.error({
                message: 'Error',
                description: location.state?.errorMessage,
                duration: 0, // stays open until manually closed
            });

            window.history.replaceState({}, '');
        }

        const searchParams = new URLSearchParams(location.search);

        // Check for email confirmation status in query params
        const emailConfirmed = searchParams.get("emailConfirmed");
        const emailChanged = searchParams.get("emailChanged");

        if (emailConfirmed === "true") {
            notification.success({ message: 'Email Confirmed', description: 'Your email has been successfully confirmed.', duration: 0 });
            searchParams.delete("emailConfirmed");
            window.history.replaceState({}, '', `${location.pathname}?${searchParams.toString()}`);
        } else if (emailConfirmed === "false") {
            notification.error({ message: 'Error', description: 'Error with confirming your email!', duration: 0 });
            searchParams.delete("emailConfirmed");
            window.history.replaceState({}, '', `${location.pathname}?${searchParams.toString()}`);
        }

        if (emailChanged === "true") {
            notification.success({ message: 'Email Changed', description: 'Your email has been successfully changed.', duration: 0 });
            searchParams.delete("emailChanged");
            window.history.replaceState({}, '', `${location.pathname}?${searchParams.toString()}`);
        } else if (emailChanged === "false") {
            notification.error({ message: 'Error', description: 'Error with changing your email!', duration: 0 });
            searchParams.delete("emailChanged");
            window.history.replaceState({}, '', `${location.pathname}?${searchParams.toString()}`);
        }

    }, [location.state, location.search]);

    return null;
};

export default Alert;
