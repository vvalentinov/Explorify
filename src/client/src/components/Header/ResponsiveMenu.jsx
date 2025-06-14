import { Button, Dropdown, Grid } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Header.module.css';
import logo from '../../assets/explorify.png';

import {
    AppstoreFilled,
    SearchOutlined,
    EnvironmentFilled,
    HeartFilled,
    StarFilled,
    EyeFilled
} from '@ant-design/icons';

import { useContext } from 'react';

import { AuthContext } from '../../contexts/AuthContext';


const { useBreakpoint } = Grid;

const ResponsiveMenu = () => {

    const { isAuthenticated } = useContext(AuthContext);

    const screens = useBreakpoint();

    const navLinksDropdown = (
        <div className={styles.mobileDropdownContent}>
            <NavLink to="/" className={styles.dropdownItem}>Home</NavLink>
            <NavLink to="/categories" className={styles.dropdownItem}>Categories</NavLink>
            <NavLink to="/search" className={styles.dropdownItem}>Search</NavLink>

            {isAuthenticated && (
                <>
                    <NavLink to="/my-places" className={styles.dropdownItem}>My Places</NavLink>
                    <NavLink to="/my-reviews" className={styles.dropdownItem}>My Reviews</NavLink>
                    <NavLink to="/my-following" className={styles.dropdownItem}>My Following</NavLink>
                    <NavLink to="/favorite-places" className={styles.dropdownItem}>Favorite Places</NavLink>
                </>
            )}
        </div>
    );

    const navLinks = (
        <div className={styles.leftMenu}>

            <Link to="/" className={styles.logoMenuItem}>
                <motion.div
                    whileHover={{
                        scale: 1.08,
                        rotate: -2,
                        y: -4,
                        transition: { type: 'spring', stiffness: 300, damping: 12 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 15,
                        cursor: 'pointer',
                    }}
                >
                    <motion.img
                        src={logo}
                        alt="Explorify"
                        className={styles.logoImage}
                        initial={{ rotate: 0 }}
                        whileHover={{
                            rotate: 10,
                            transition: { type: 'spring', stiffness: 300, damping: 14 }
                        }}
                    />
                    <motion.span
                        initial={{ x: 0, color: '#2c3e50' }}
                        whileHover={{
                            x: 4,
                            color: '#43c0c1',
                            transition: { type: 'spring', stiffness: 250, damping: 12 }
                        }}
                        style={{ fontWeight: 600, fontSize: '2rem', fontFamily: 'Courier New, monospace' }}
                    >
                        Explorify
                    </motion.span>
                </motion.div>

            </Link>

            <div className={styles.leftMenuLinksContainer}>
                <NavLink
                    to="/categories"
                    style={{ marginLeft: '2rem' }}
                    className={({ isActive }) =>
                        `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`
                    }
                >
                    <div className={styles.navLinkContentContainer}>
                        <AppstoreFilled />
                        Categories
                    </div>

                </NavLink>

                <NavLink
                    to="/search"
                    className={({ isActive }) => `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
                >
                    <div className={styles.navLinkContentContainer}>
                        <SearchOutlined />
                        Search
                    </div>

                </NavLink>


                {isAuthenticated && (
                    <>
                        <NavLink
                            to="/my-places"
                            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
                        >
                            <div className={styles.navLinkContentContainer}>
                                <EnvironmentFilled />
                                My Places
                            </div>
                        </NavLink>

                        <NavLink
                            to="/my-reviews"
                            className={({ isActive }) =>
                                `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`
                            }
                        >
                            <div className={styles.navLinkContentContainer}>
                                <StarFilled />
                                My Reviews
                            </div>
                        </NavLink>

                        <NavLink
                            to="/my-following"
                            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
                        >
                            <div className={styles.navLinkContentContainer}>
                                <EyeFilled />
                                My Following
                            </div>
                        </NavLink>

                        <NavLink
                            to="/favorite-places"
                            className={({ isActive }) =>
                                `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`
                            }
                        >
                            <div className={styles.navLinkContentContainer}>
                                <HeartFilled color='red' />
                                Favorite Places
                            </div>
                        </NavLink>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div>
            {screens.xl ? (
                navLinks
            ) : (
                <Dropdown
                    trigger={["click"]}
                    placement="bottomRight"
                    popupRender={() => navLinksDropdown}
                >
                    <Button type="text" icon={<MenuOutlined style={{ fontSize: '1.5rem' }} />} />
                </Dropdown>
            )}
        </div>
    );
};

export default ResponsiveMenu;
