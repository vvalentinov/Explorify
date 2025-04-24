import { message } from 'antd';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {

    const location = useLocation();

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (location.state?.username) {
            messageApi.success(`Hello ${location.state.username}! 👋`);
            window.history.replaceState({}, '');
        }
    }, [location.state]);

    return (
        <>
            {contextHolder}
            <h2>This is the home page!</h2>
        </>
    );
};

export default Home;