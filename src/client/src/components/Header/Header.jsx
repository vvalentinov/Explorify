import styles from './Header.module.css';

import {
    Button,
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
    CrownOutlined,
    BellOutlined
} from '@ant-design/icons';

import ResponsiveMenu from './ResponsiveMenu';

import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';

import * as paths from '../../constants/paths';

import { AuthContext } from '../../contexts/AuthContext';

import { NotificationContext } from '../../contexts/NotificationContext';

const { useToken } = theme;
const { useBreakpoint } = Grid;

import { motion } from 'framer-motion';

import slugify from 'slugify';

const Header = () => {

    const { isAuthenticated, profileImageUrl, isAdmin, userName } = useContext(AuthContext);

    const { notificationCount } = useContext(NotificationContext);

    const { token } = useToken();

    const screens = useBreakpoint();

    const dropDownItems = [
        {
            key: '1',
            label: (
                <NavLink style={{ fontSize: '1.5rem' }} to={`/profile/${slugify(userName ?? '', { lower: true })}`}>
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
                        <NavLink style={{ fontSize: '1.5rem' }} to="/admin">
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
                <NavLink style={{ fontSize: '1.5rem' }} to={paths.uploadPlacePath}>
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
                <NavLink style={{ fontSize: '1.5rem' }} to={paths.logoutPath}>
                    <LogoutOutlined style={{ marginRight: '0.5rem' }} />
                    Logout
                </NavLink>
            ),
        },
    ];

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
            <nav
                style={{
                    backgroundColor: token.colorBgContainer,
                    borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 1000,
                    padding: '1.5rem 0'
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // padding: screens.md ? `0px ${token.paddingLG}px` : `0px ${token.padding}px`,
                        width: "100%",
                        // margin: "0 1rem"
                    }}
                >

                    {/* LEFT */}
                    <ResponsiveMenu />

                    {/* RIGHT */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginRight: '12rem' }}>
                        {!isAuthenticated ? (
                            <>
                                <NavLink to={paths.signInPath}>
                                    <Button type="text" size="large" style={{ fontSize: '1.5rem', padding: '1.5rem 2rem' }}>Sign In</Button>
                                </NavLink>
                                <NavLink to={paths.signUpPath}>
                                    <Button type="primary" size="large" style={{ fontSize: '1.5rem', padding: '1.5rem 2rem' }}>Sign Up</Button>
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <Badge title="Notifications" color="green" className={styles.customBadgeDot} dot={notificationCount > 0}>
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: -10 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <Link to="/notifications" style={{ color: 'inherit', display: 'flex' }}>
                                            <BellOutlined style={{ fontSize: '1.8rem' }} />
                                        </Link>
                                    </motion.div>
                                </Badge>

                                <Dropdown
                                    arrow
                                    menu={{ items: dropDownItems }}
                                    placement="bottom"
                                    trigger={['click']}
                                >
                                    <div className={styles.avatarHoverWrapper}>
                                        <Avatar size={70} src={profileImageUrl} icon={!profileImageUrl && <UserOutlined />} />
                                    </div>
                                </Dropdown>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </ConfigProvider>


    );
};

export default Header;