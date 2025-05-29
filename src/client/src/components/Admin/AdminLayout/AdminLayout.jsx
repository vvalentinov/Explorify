import styles from './AdminLayout.module.css';

import { Layout, Menu, FloatButton } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    CommentOutlined,
} from '@ant-design/icons';

import AdminDashboard from '../AdminDashboard';
import AdminUsers from '../Users';

// import Reviews from '../../Review/Reviews';

import AdminPlaces from '../../Place/AdminPlaces';

import PlaceDetails from '../../Place/PlaceDetails/PlaceDetails';

import ScrollToTop from '../../ScrollToTop/ScrollToTop';

import ReviewsSection from '../../Review/ReviewsSection';

const { Header, Content, Footer } = Layout;

const AdminLayout = () => {

    const navigate = useNavigate();

    const leftMenuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/admin'),
        },
        {
            key: 'places',
            icon: <EnvironmentOutlined />,
            label: 'Places',
            onClick: () => navigate('/admin/places'),
        },
        {
            key: 'reviews',
            icon: <CommentOutlined />,
            label: 'Reviews',
            onClick: () => navigate('/admin/reviews'),
        },
        {
            key: 'users',
            icon: <UserOutlined />,
            label: 'Users',
            onClick: () => navigate('/admin/users'),
        },
    ];

    const rightMenuItems = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Main Site',
            onClick: () => navigate('/'),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>

            <ScrollToTop />

            <Header className={styles.adminHeader}>

                <div className={styles.adminNavContainer}>

                    {/* Left side: admin links */}
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        items={leftMenuItems}
                        className={styles.adminMenuLeft}
                    />

                    {/* Right side: main site link */}
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        items={rightMenuItems}
                        selectable={false}
                        className={styles.adminMenuRight}
                    />
                </div>
            </Header>

            <Content className={styles.adminContent}>

                <Routes>
                    <Route index element={<AdminDashboard />} />

                    <Route path="users" element={<AdminUsers />} />

                    <Route path='places' element={<AdminPlaces />} />
                    <Route path='place/:placeName' element={<PlaceDetails isForAdmin={true} />} />

                    <Route path='reviews' element={<ReviewsSection isForPlace={false} isForUser={false} isForAdmin={true} />} />
                </Routes>

                <FloatButton.BackTop />

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
                <div style={{ fontSize: '14px' }}>
                    Admin Panel · Explorify ©{new Date().getFullYear()} · Built with ❤️ by the Explorify Team
                </div>
            </Footer>

        </Layout>
    );
};

export default AdminLayout;
