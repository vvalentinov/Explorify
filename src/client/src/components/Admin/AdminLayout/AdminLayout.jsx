import styles from './AdminLayout.module.css';

import { Layout, Menu, FloatButton } from 'antd';
import { Route, Routes, useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    CommentOutlined,
} from '@ant-design/icons';

import AdminDashboard from '../AdminDashboard';
import AdminUsers from '../Users';

import AdminPlaces from '../../Place/AdminPlaces';

import PlaceDetails from '../../Place/PlaceDetails/PlaceDetails';

import ScrollToTop from '../../ScrollToTop/ScrollToTop';

import ReviewsSection from '../../Review/ReviewsSection/ReviewsSection';

const { Header, Content, Footer } = Layout;

const AdminLayout = () => {

    const navigate = useNavigate();

    const leftMenuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined style={{ fontSize: '25px' }} />,
            label: 'Dashboard',
            path: '/admin',
        },
        {
            key: 'places',
            icon: <EnvironmentOutlined style={{ fontSize: '25px' }} />,
            label: 'Places',
            path: '/admin/places',
        },
        {
            key: 'reviews',
            icon: <CommentOutlined style={{ fontSize: '25px' }} />,
            label: 'Reviews',
            path: '/admin/reviews',
        },
        {
            key: 'users',
            icon: <UserOutlined style={{ fontSize: '25px' }} />,
            label: 'Users',
            path: '/admin/users',
        },
    ];


    const rightMenuItems = [
        {
            key: 'home',
            icon: <HomeOutlined style={{ fontSize: '25px' }} />,
            label: 'Main Site',
            path: '/',
        },
    ];

    return (
        <Layout>

            <ScrollToTop />

            <Header className={styles.adminHeader}>

                <div className={styles.adminNavContainer}>

                    <div className={styles.adminMenuLeft}>
                        {leftMenuItems.map(item => (
                            <NavLink
                                key={item.key}
                                to={item.path}
                                end={item.path === '/admin'} // only add `end` for exact match paths like dashboard
                                className={({ isActive }) =>
                                    `${styles.menuItem} ${isActive ? styles.activeMenuItem : ''}`
                                }
                            >
                                {item.icon}
                                <span style={{ marginLeft: 8 }}>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>



                    <div className={styles.adminMenuRight}>
                        {rightMenuItems.map(item => (
                            <NavLink
                                key={item.key}
                                to={item.path}
                                end={item.path === '/admin'}
                                className={({ isActive }) =>
                                    `${styles.menuItem} ${isActive ? styles.activeMenuItem : ''}`
                                }
                            >
                                {item.icon}
                                <span style={{ marginLeft: 8 }}>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>

                </div>

            </Header>


            <Content className={styles.adminContent}>

                <Routes>
                    <Route index element={<AdminDashboard />} />

                    <Route path="users" element={<AdminUsers />} />

                    <Route path='places' element={<AdminPlaces />} />
                    <Route path='place/:placeName' element={<PlaceDetails isForAdmin={true} />} />

                    <Route
                        path='reviews'
                        element={<ReviewsSection isForPlace={false} isForUser={false} isForAdmin={true} />}
                    />
                </Routes>

                <FloatButton.BackTop className="custom-backtop" />

            </Content>

            <Footer
                style={{
                    backgroundColor: '#1f1e2f',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '3rem 2rem',
                    borderTop: '1px solid #2c2c3e',
                }}
            >
                <div style={{ fontSize: '20px' }}>
                    Admin Panel · Explorify ©{new Date().getFullYear()} · Built with ❤️ by the Explorify Team
                </div>
            </Footer>

        </Layout>
    );
};

export default AdminLayout;
