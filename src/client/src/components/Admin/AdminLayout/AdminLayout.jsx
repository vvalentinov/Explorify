import styles from './AdminLayout.module.css';

import { Layout, Menu, Dropdown, Space, FloatButton } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    CommentOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

import AdminUsers from '../Users/Users';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import Reviews from '../Reviews/Reviews';

import Places from '../Places/Places';
import Place from '../Place/Place';

import ScrollToTop from '../../ScrollToTop/ScrollToTop';

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

                    <Route path='places' element={<Places />} />
                    <Route path='place/:placeName' element={<Place />} />

                    <Route path='reviews' element={<Reviews />} />
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
