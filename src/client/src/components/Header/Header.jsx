import styles from './Header.module.css';

import {
    Button,
    Menu,
    Space,
    theme,
    Grid,
    ConfigProvider,
    Avatar,
    Dropdown
} from "antd";

import {
    UserOutlined,
    LogoutOutlined,
    UploadOutlined,
    MenuOutlined
} from '@ant-design/icons';

import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';

import * as paths from '../../constants/paths';
import { AuthContext } from '../../contexts/AuthContext';

import { useState } from 'react';

const { useToken } = theme;
const { useBreakpoint } = Grid;

const menuItems = [
    {
        label: <Link style={{ fontSize: '1.2rem' }} to='/'>Explorify</Link>,
        key: "home",
    },
    {
        label: <Link style={{ fontSize: '1.2rem' }} to='/categories'>Categories</Link>,
        key: "categories",
    },
];

const dropDownItems = [
    {
        key: '1',
        label: (
            <NavLink style={{ fontSize: '1.2rem' }} to={paths.profilePath}>
                <UserOutlined style={{ marginRight: '0.5rem' }} />
                Profile
            </NavLink>
        ),
    },
    {
        key: '2',
        label: (
            <NavLink style={{ fontSize: '1.2rem' }} to={paths.uploadPlacePath}>
                <UploadOutlined style={{ marginRight: '0.5rem' }} />
                Upload
            </NavLink>
        ),
    },
    {
        type: 'divider',
    },
    {
        key: '4',
        label: (
            <NavLink style={{ fontSize: '1.2rem' }} to={paths.logoutPath}>
                <LogoutOutlined style={{ marginRight: '0.5rem' }} />
                Logout
            </NavLink>
        ),
    },
];

const Header = () => {

    const { isAuthenticated } = useContext(AuthContext);

    const { token } = useToken();

    const screens = useBreakpoint();

    const dynamicStyles = {
        container: {
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            margin: "0 auto",
            maxWidth: token.screenXL,
            padding: screens.md ? `0px ${token.paddingLG}px` : `0px ${token.padding}px`
        },
        header: {
            // backgroundColor: '#E9FFF1',
            // borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorBgBase}`,
            backgroundColor: token.colorBgContainer,
            borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1000,
            minHeight: '63px'
        },
        logo: {
            display: "block",
            height: token.sizeLG,
            left: "50%",
            position: screens.md ? "static" : "absolute",
            top: "50%",
            transform: screens.md ? " " : "translate(-50%, -50%)"
        },
        menu: {
            backgroundColor: "transparent",
            borderBottom: "none",
            lineHeight: screens.sm ? "4rem" : "3.5rem",
            marginLeft: screens.md ? "0px" : `-${token.size}px`,
            width: screens.md ? "inherit" : token.sizeXXL
        },
        menuContainer: {
            alignItems: "center",
            display: "flex",
            gap: token.size,
            width: "100%"
        }
    };

    const [current, setCurrent] = useState("home");
    const onClick = (e) => setCurrent(e.key);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#43c0c1',
                    // colorPrimary: '#4c6a76',
                },
                components: {
                    // Dropdown: {
                    //     backgroundColor: '#e6fffb',
                    // }
                }
            }}
        >
            <nav style={dynamicStyles.header}>
                <div style={dynamicStyles.container}>
                    <div style={dynamicStyles.menuContainer}>
                        <Menu
                            style={dynamicStyles.menu}
                            mode="horizontal"
                            items={menuItems}
                            onClick={onClick}
                            selectedKeys={screens.md ? [current] : ""}
                            overflowedIndicator={
                                <Button type="text" icon={<MenuOutlined />}></Button>
                            }
                            defaultSelectedKeys={['home']}
                        />
                    </div>
                    <Space>
                        {
                            !isAuthenticated
                                ?
                                <>
                                    <NavLink to={paths.signInPath}>
                                        <Button color='cyan' variant='text' size='large'>Sign In</Button>
                                    </NavLink>
                                    <NavLink to={paths.signUpPath}>
                                        <Button color='cyan' variant='solid' size='large'>Sign Up</Button>
                                    </NavLink>
                                </>
                                :
                                <Dropdown
                                    arrow={true}
                                    menu={{ items: dropDownItems }}
                                    placement="bottom"
                                >
                                    <Avatar
                                        style={{ marginRight: '2rem' }}
                                        size="large"
                                        icon={<UserOutlined />}
                                    />
                                </Dropdown>
                        }
                    </Space>
                </div>
            </nav>
        </ConfigProvider>

    );
};

export default Header;