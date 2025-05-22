import styles from './AdminLayout.module.css';

import { Layout, Menu, Dropdown, Space, Button, FloatButton, ConfigProvider } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    CommentOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

import { useLocation } from 'react-router-dom';

import AdminUsers from '../AdminUsers/AdminUsers';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import UnadpprovedPlaces from '../UnapprovedPlaces/UnapprovedPlaces';
import UnapprovedReviews from '../UnapprovedReviews/UnapprovedReviews';
import ApprovedPlaces from '../AppovedPlaces/ApprovedPlaces';
import ApprovedPlace from '../ApprovedPlace/ApprovedPlace';

import ScrollToTop from '../../ScrollToTop/ScrollToTop';

import UnapprovedPlace from '../UnapprovedPlace/UnapprovedPlace';

const { Header, Content, Footer } = Layout;

import { useState, useEffect } from 'react';

const AdminLayout = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const pathname = location.pathname;

    const getSelectedKey = () => {
        if (pathname === '/admin') return 'dashboard';
        if (pathname.startsWith('/admin/users')) return 'users';
        if (pathname.startsWith('/admin/approved-places') || pathname.startsWith('/admin/unapproved-places')) {
            return 'places-dropdown';
        }
        if (pathname.startsWith('/admin/approved-reviews') || pathname.startsWith('/admin/unapproved-reviews')) {
            return 'reviews-dropdown';
        }
        return '';
    };

    const selectedKey = getSelectedKey();

    const placesMenu = {
        items: [
            {
                key: 'approved',
                icon: <EnvironmentOutlined />,
                label: 'Approved Places',
                onClick: () => navigate('/admin/approved-places'),
            },
            {
                key: 'unapproved',
                label: 'Unapproved Places',
                icon: <CloseCircleOutlined />,
                onClick: () => navigate('/admin/unapproved-places'),
            },
            {
                key: 'deleted',
                label: 'Deleted Places',
                disabled: true,
            },
        ],
    };

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
            key: 'places-dropdown',
            onClick: () => { },
            label: (
                <Dropdown placement="bottom" menu={placesMenu} trigger={['click']}>
                    <span
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        onClick={(e) => e.preventDefault()}
                    >
                        <Space>
                            <EnvironmentOutlined /> Places
                        </Space>
                    </span>
                </Dropdown>
            ),
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
                        selectedKeys={[selectedKey]}
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
                    <Route path="unapproved-places" element={<UnadpprovedPlaces />} />
                    <Route path="approved-places" element={<ApprovedPlaces />} />
                    <Route path="unapproved-reviews" element={<UnapprovedReviews />} />
                    <Route path="unapproved-place/:placeName" element={<UnapprovedPlace />} />
                    <Route path="approved-place/:placeName" element={<ApprovedPlace />} />
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
