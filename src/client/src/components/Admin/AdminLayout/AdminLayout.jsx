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

import AdminUsers from '../AdminUsers/AdminUsers';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import UnapprovedReviews from '../UnapprovedReviews/UnapprovedReviews';

import Places from '../Places/Places';
import Place from '../Place/Place';

import ScrollToTop from '../../ScrollToTop/ScrollToTop';

const { Header, Content, Footer } = Layout;

const AdminLayout = () => {

    const navigate = useNavigate();

    const reviewsMenu = {
        items: [
            {
                key: 'approved-reviews',
                icon: <CommentOutlined />,
                label: 'Approved Reviews',
                onClick: () => navigate('/admin/approved-reviews'),
            },
            {
                key: 'unapproved-reviews',
                label: 'Unapproved Reviews',
                icon: <CloseCircleOutlined />,
                onClick: () => navigate('/admin/unapproved-reviews'),
            },
            {
                key: 'deleted',
                label: 'Deleted reviews',
                disabled: true,
            },
        ]
    }

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
            key: 'reviews-dropdown',
            label: (
                <Dropdown placement='bottom' menu={reviewsMenu}>
                    <span
                        style={{
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#a7adb4',
                        }}
                        onClick={(e) => e.preventDefault()}
                    >
                        <Space>
                            <CommentOutlined /> Reviews
                        </Space>
                    </span>
                </Dropdown>
            ),
            disabled: true,
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
                    <Route path="unapproved-reviews" element={<UnapprovedReviews />} />

                    <Route path='places' element={<Places />} />
                    <Route path='place/:placeName' element={<Place />} />
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
