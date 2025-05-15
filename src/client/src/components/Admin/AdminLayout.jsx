import { Layout, Menu } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
    HomeOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';

// import AdminUsers from '../../pages/admin/AdminUsers';
// import AdminSettings from '../../pages/admin/AdminSettings';
// import NoPathFound from '../../components/NoPathFound/NoPathFound';

import UnadpprovedPlaces from './UnapprovedPlaces/UnapprovedPlaces';

import UnapprovedReviews from './UnapprovedReviews/UnapprovedReviews';

import AdminUsers from './AdminUsers/AdminUsers';

import AdminDashboard from './AdminDashboard/AdminDashboard';

const { Header, Sider, Content } = Layout;

import { useState, useEffect } from 'react';

const AdminLayout = () => {

    const navigate = useNavigate();

    const menuItems = [
        {
            key: 'explorify',
            icon: <HomeOutlined />,
            label: 'Explorify',
            onClick: () => navigate('/'),
        },
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/admin'),
        },
        {
            key: 'users',
            icon: <UserOutlined />,
            label: 'Users',
            onClick: () => navigate('/admin/users'),
        },
        {
            key: 'unapproved-places',
            icon: <EnvironmentOutlined />,
            label: 'Places',
            onClick: () => navigate('/admin/unapproved-places'),
        },
        {
            key: 'unapproved-reviews',
            icon: <EnvironmentOutlined />,
            label: 'Reviews',
            onClick: () => navigate('/admin/unapproved-reviews'),
        },
    ];

    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>

            <Sider theme="dark" collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <div className="logo" style={{ padding: 16, color: 'white', textAlign: 'center' }}>
                    Admin Panel
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    items={menuItems}
                />
            </Sider>

            <Layout>
                <Content style={{
                    // margin: '16px',
                    background: '#fff',
                    // padding: '24px',
                }}>
                    <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path='unapproved-places' element={<UnadpprovedPlaces />} />
                        <Route path='unapproved-reviews' element={<UnapprovedReviews />} />

                        {/* <Route path="*" element={<NoPathFound />} />  */}
                    </Routes>
                </Content>
            </Layout>

        </Layout>
    );
};

export default AdminLayout;
