import { Button, Dropdown, Grid } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Header.module.css';
import logo from '../../assets/explorify.png';

import { AppstoreOutlined, SearchOutlined } from '@ant-design/icons';


const { useBreakpoint } = Grid;

const ResponsiveMenu = () => {

    const screens = useBreakpoint();

    const navLinksDropdown = (
        <div className={styles.mobileDropdownContent}>
            <NavLink to="/" className={styles.dropdownItem}>Home</NavLink>
            <NavLink to="/categories" className={styles.dropdownItem}>Categories</NavLink>
            <NavLink to="/search" className={styles.dropdownItem}>Search</NavLink>
        </div>
    );

    const navLinks = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
                        marginRight: screens.lg ? '5rem' : '0'
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

            <NavLink to="/categories" className={styles.navItem}>
                <AppstoreOutlined style={{ marginRight: '0.5rem' }} />
                Categories
            </NavLink>

            <NavLink to="/search" className={styles.navItem}>
                <SearchOutlined style={{ marginRight: '0.5rem' }} />
                Search
            </NavLink>

        </div>

    );

    return (
        <div>
            {screens.md ? (
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
