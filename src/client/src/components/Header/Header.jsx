import styles from './Header.module.css';

import {
    Button,
    Menu,
    Space,
    theme,
    Grid,
    ConfigProvider,
    Avatar,
    Dropdown,
    Badge
} from "antd";

import {
    UserOutlined,
    LogoutOutlined,
    UploadOutlined,
    MenuOutlined,
    CrownOutlined,
    BellOutlined
} from '@ant-design/icons';

import ResponsiveMenu from './ResponsiveMenu';

import { useContext } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

import * as paths from '../../constants/paths';

import { AuthContext } from '../../contexts/AuthContext';

import { NotificationContext } from '../../contexts/NotificationContext';

const { useToken } = theme;
const { useBreakpoint } = Grid;

import { motion } from 'framer-motion';

import logo from '../../assets/explorify.png';

import slugify from 'slugify';

const menuItems = [
    {
        label: (
            <motion.div
                whileHover={{
                    scale: 1.05,
                    y: -2,
                    color: "#43c0c1",
                    transition: { type: 'spring', stiffness: 300, damping: 10 }
                }}
                whileTap={{ scale: 0.97 }}
            >
                <Link to="/" className={styles.logoMenuItem}>
                    <img src={logo} alt="Explorify" className={styles.logoImage} />
                    <span>Explorify</span>
                </Link>
            </motion.div>
        ),
        key: "home",
    },
    {
        label: <Link style={{ fontSize: '1.2rem' }} to='/categories'>Categories</Link>,
        key: "categories",
    },
    {
        label: <Link style={{ fontSize: '1.2rem' }} to='/search'>Search</Link>,
        key: "search",
    }
];

const Header = () => {

    const { isAuthenticated, profileImageUrl, isAdmin, userName } = useContext(AuthContext);
    const { notificationCount } = useContext(NotificationContext);

    const { token } = useToken();

    const screens = useBreakpoint();

    const dropDownItems = [
        {
            key: '1',
            label: (
                <NavLink style={{ fontSize: '1.2rem' }} to={`/profile/${slugify(userName ?? '', { lower: true })}`}>
                    <UserOutlined style={{ marginRight: '0.5rem' }} />
                    Profile
                </NavLink>
            ),
        },
        ...(isAdmin
            ? [
                {
                    key: '3',
                    label: (
                        <NavLink style={{ fontSize: '1.2rem' }} to="/admin">
                            <CrownOutlined style={{ marginRight: '0.5rem' }} />
                            Admin
                        </NavLink>
                    ),
                },
            ]
            : []),
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
            key: '5',
            label: (
                <NavLink style={{ fontSize: '1.2rem' }} to={paths.logoutPath}>
                    <LogoutOutlined style={{ marginRight: '0.5rem' }} />
                    Logout
                </NavLink>
            ),
        },
    ];

    const dynamicStyles = {
        container: {
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            margin: "0 auto",
            maxWidth: token.screenXL,
            padding: screens.md ? `0px ${token.paddingLG}px` : `0px ${token.padding}px`,
            // border: 'solid 1px black'
        },
        header: {
            backgroundColor: token.colorBgContainer,
            borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1000,
            // minHeight: '63px',
            padding: '1.5rem 0'
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

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#43c0c1',
                },
                components: {
                    Menu: {
                        itemSelectedColor: 'inherit',
                        itemSelectedBg: 'transparent',
                        horizontalItemSelectedColor: 'inherit',
                        horizontalItemHoverBorderBottom: '0px',
                        horizontalItemSelectedBorderBottom: '0px',
                    },
                },
            }}
        >

            <nav style={dynamicStyles.header}>
                <div style={dynamicStyles.container}>
                    <div style={dynamicStyles.menuContainer}>
                        <ResponsiveMenu />
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
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '1.5rem'
                                    }}
                                >

                                    <Badge title="Notifications" color="green" size="small" count={notificationCount}>
                                        <motion.div
                                            whileHover={{
                                                scale: 1.1,
                                                rotate: -10,
                                                transition: { type: 'spring', stiffness: 250, damping: 12 }
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{ display: 'flex', alignItems: 'center' }}
                                        >
                                            <Link
                                                to="/notifications"
                                                style={{
                                                    color: 'inherit',
                                                    textDecoration: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <BellOutlined style={{ fontSize: '1.5rem' }} />
                                            </Link>
                                        </motion.div>
                                    </Badge>


                                    <div style={{ marginRight: '2rem' }}>
                                        <Dropdown
                                            arrow
                                            menu={{ items: dropDownItems }}
                                            placement="bottom"
                                            trigger={['click']}
                                        >
                                            <div className={styles.avatarHoverWrapper}>
                                                {profileImageUrl ? (
                                                    <Avatar size={50} src={profileImageUrl} />

                                                ) : (
                                                    <Avatar size="large" icon={<UserOutlined />} />
                                                )}
                                            </div>
                                        </Dropdown>
                                    </div>

                                </div>
                        }
                    </Space>
                </div>
            </nav>
        </ConfigProvider>

    );
};

export default Header;