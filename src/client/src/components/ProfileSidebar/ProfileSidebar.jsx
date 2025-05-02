import { Link } from "react-router-dom";

import { Menu, ConfigProvider } from "antd";

import {
    MailOutlined,
    SettingOutlined,
    UserOutlined,
    ProfileOutlined,
} from '@ant-design/icons';

import { changePasswordPath, changeUsernamePath, profilePath } from "../../constants/paths";

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
        label: 'Change Email',
        icon: <MailOutlined style={{ fontSize: '1.3rem' }} />,
    }
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
                    backgroundColor: '#e6fffb',
                    overflowY: 'auto',
                }}
                defaultSelectedKeys={['profile']}
                mode="vertical"
                items={items}
            />
        </ConfigProvider>
    )
};

export default ProfileSidebar;