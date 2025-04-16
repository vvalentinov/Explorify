import styles from './Header.module.css';

import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Button, Menu, Space, ConfigProvider } from "antd";

import * as paths from '../../constants/paths';

const menuItems = [
    {
        label: <NavLink to={paths.homePath}>Home</NavLink>,
        key: "explorify",
    },
    {
        label: <NavLink to={paths.homePath}>Categories</NavLink>,
        key: "categories",
    },
];

const Header = () => {

    const [current, setCurrent] = useState("explorify");
    const onClick = (e) => setCurrent(e.key);

    return (
        <nav className={styles.navbar}>
            <div className={styles.menuContainer}>
                <ConfigProvider
                    theme={{
                        components: {
                            Menu: {
                                // itemColor: 'green',
                                // itemHoverColor: '#1890ff',
                                // itemHoverBg: '#e6f7ff',
                                // itemSelectedColor: '#fff',
                                // itemSelectedBg: '#1890ff',
                                // horizontalItemSelectedColor: '#ff4d4f',
                            },
                        },
                    }}
                >
                    <Menu
                        className={styles.menu}
                        mode="horizontal"
                        items={menuItems}
                        onClick={onClick}
                        selectedKeys={[current]}
                    />
                </ConfigProvider>
            </div>
            <Space className={styles.buttonsContainer}>
                <NavLink to={paths.signInPath}>
                    <Button className={styles.button} variant='filled' size='large'>Sign In</Button>
                </NavLink>
                <NavLink to={paths.signUpPath}>
                    <Button className={styles.button} variant='filled' size='large' >Sign Up</Button>
                </NavLink>
            </Space>
        </nav>
    );
};

export default Header;