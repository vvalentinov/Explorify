import styles from './Header.module.css';

import {
    Button,
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

import { useContext, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

import * as paths from '../../constants/paths';

import { AuthContext } from '../../contexts/AuthContext';

import { NotificationContext } from '../../contexts/NotificationContext';

import { motion } from 'framer-motion';

import slugify from 'slugify';

const Header = () => {

    const { isAuthenticated, profileImageUrl, isAdmin, userName } = useContext(AuthContext);

    const { notificationCount } = useContext(NotificationContext);

    const [avatarLoading, setAvatarLoading] = useState(true);

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
            : []
        ),
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

        <nav className={styles.navbar}>

            <div className={styles.navbarContainer}>

                <ResponsiveMenu />

                <div className={styles.rigthMenu}>

                    {!isAuthenticated ? (
                        <>
                            <NavLink to={paths.signInPath}>
                                <Button color='cyan' variant='solid' size="large" className={styles.rigthMenuBtn}>Sign In</Button>
                            </NavLink>
                            <NavLink to={paths.signUpPath}>
                                <Button color='cyan' variant='solid' size="large" className={styles.rigthMenuBtn}>Sign Up</Button>
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <Badge
                                title="Notifications"
                                color="green"
                                className={styles.customBadgeDot}
                                count={notificationCount}
                            >
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
                                    <Avatar
                                        size={70}
                                        icon={!profileImageUrl && <UserOutlined />}
                                        // src={profileImageUrl}
                                        src={
                                            profileImageUrl && (
                                                <img
                                                    src={profileImageUrl}
                                                    onLoad={() => setAvatarLoading(false)}
                                                    style={{ display: avatarLoading ? 'none' : 'block' }}
                                                    alt="User avatar"
                                                />
                                            )
                                        }
                                    />
                                </div>
                            </Dropdown>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;