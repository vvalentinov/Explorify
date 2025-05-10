import { Link } from "react-router-dom";

import { Menu, Card, ConfigProvider } from "antd";

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

const IconWrapper = ({ icon }) => (
    <div style={{
        backgroundColor: '#43c0c1',
        borderRadius: '50%',
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'
    }}>
        {icon}
    </div>
);

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
    return (
        <div style={
            {
                minHeight: 'calc(100vh - 63px)',
                backgroundColor: '#e6fffb',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2rem 0',
                boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
                // border: 'solid 1px black'
            }
        }>

            <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#43c0c1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
            }}>
                <UserOutlined />
            </div>

            <Card
                variant="borderless"
                style={{
                    borderRadius: 16,
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
            >
                <ConfigProvider theme={{
                    components: {
                        Menu: {
                            itemSelectedColor: 'green',
                            itemSelectedBg: '#b6e4b3'
                        }
                    }
                }}>
                    <Menu
                        items={items}
                        mode="vertical"
                        defaultSelectedKeys={['profile']}
                        style={{
                            fontSize: '1.1rem',
                            backgroundColor: '#e6fffb',
                            borderRight: 'none',
                            boxShadow: '2px 0 5px rgba(0, 0, 0, 0.05)'
                        }}
                    />
                </ConfigProvider>
            </Card>
        </div>
    );
};

export default ProfileSidebar;