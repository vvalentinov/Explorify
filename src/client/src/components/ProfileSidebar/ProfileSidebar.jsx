import { useState } from "react";
import { Link } from "react-router-dom";

import { Menu, ConfigProvider, Layout } from "antd";

import {
    MailOutlined,
    SettingOutlined,
    UserOutlined,
    ProfileOutlined,
} from '@ant-design/icons';

import {
    changePasswordPath,
    changeUsernamePath,
    profilePath,
    changeEmailPath,
} from "../../constants/paths";

const items = [
    {
        key: 'profile',
        label: <Link to={profilePath}>Profile</Link>,
        icon: <ProfileOutlined style={{ fontSize: '1.3rem' }} />,
    },
    {
        key: 'change-username',
        label: <Link to={changeUsernamePath}>Change Username</Link>,
        icon: <UserOutlined style={{ fontSize: '1.3rem' }} />,
    },
    {
        key: 'change-password',
        label: <Link to={changePasswordPath}>Change Password</Link>,
        icon: <SettingOutlined style={{ fontSize: '1.3rem' }} />,
    },
    {
        key: 'change-email',
        label: <Link to={changeEmailPath}>Change Email</Link>,
        icon: <MailOutlined style={{ fontSize: '1.3rem' }} />,
    }
];

const ProfileSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (

        <ConfigProvider theme={{
            components: {
                Menu: {
                    itemColor: '#ffffff',
                    itemHoverColor: '#ffffff',
                    itemBg: '#041529',
                    itemHoverBg: '#17395f',
                    itemSelectedBg: '#264c7d',
                    itemSelectedColor: '#ffffff'
                }
            }
        }}>
            <Layout.Sider
                collapsible
                collapsed={collapsed}
                onCollapse={value => setCollapsed(value)}
            >
                <div
                    className="logo"
                    style={{
                        padding: 16,
                        color: 'white',
                        textAlign: 'center',
                    }}>
                    Account
                </div>
                <Menu
                    style={{
                        backgroundColor: '#041529',
                        color: 'white',
                    }}
                    mode="vertical"
                    defaultSelectedKeys={['profile']}
                    items={items}
                />
            </Layout.Sider>
        </ConfigProvider>
    );
};

export default ProfileSidebar;