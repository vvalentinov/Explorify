import { Link } from "react-router-dom";

import { Menu, ConfigProvider } from "antd";

import { AppstoreOutlined, MailOutlined, SettingOutlined, UserOutlined, ProfileOutlined } from '@ant-design/icons';

const items = [
    {
        key: 'profile',
        label: 'Profile',
        icon: <ProfileOutlined style={{ fontSize: '1.3rem' }} />,
    },
    {
        key: 'change-username',
        label: 'Change Username',
        icon: <UserOutlined style={{ fontSize: '1.3rem' }} />,
    },
    {
        key: 'change-password',
        label: 'Change Password',
        icon: <SettingOutlined style={{ fontSize: '1.3rem' }} />,
    },
    {
        key: 'change-email',
        label: 'Change Email',
        icon: <MailOutlined style={{ fontSize: '1.3rem' }} />,
    },
];

const ProfileSidebar = () => {

    return (
        <ConfigProvider
            theme={{
                components: {
                    Menu: {
                        itemSelectedBg: '#43c0c1',
                        itemSelectedColor: '#ffffff',
                        itemColor: '#000000',
                        itemHoverBg: '#b2ebe9',
                    },
                },
            }}
        >
            <Menu
                style={{
                    width: '100%',
                    fontSize: '1.3rem',
                    minHeight: 'calc(100vh - 221px)',
                    backgroundColor: '#e6fffb'
                }}
                defaultSelectedKeys={['profile']}
                mode="vertical"
                items={items}
            />
        </ConfigProvider>
    )
};

export default ProfileSidebar;