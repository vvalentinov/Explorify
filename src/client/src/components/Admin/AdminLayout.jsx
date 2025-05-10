import { Layout, Menu } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';

// import AdminUsers from '../../pages/admin/AdminUsers';
// import AdminSettings from '../../pages/admin/AdminSettings';
// import NoPathFound from '../../components/NoPathFound/NoPathFound';

import AdminUsers from './AdminUsers/AdminUsers';

import AdminDashboard from './AdminDashboard/AdminDashboard';

const { Header, Sider, Content } = Layout;

import { useState } from 'react';

const AdminLayout = () => {

    const navigate = useNavigate();

    const menuItems = [
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
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => navigate('/admin/settings'),
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
                        {/* <Route path="users" element={<AdminUsers />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="*" element={<NoPathFound />} /> */}
                    </Routes>
                </Content>
            </Layout>

        </Layout>
    );
};

export default AdminLayout;
