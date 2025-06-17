import { Card, Button, Typography } from 'antd';

import {
    MailOutlined,
    LockOutlined,
    UserOutlined,
    SettingFilled
} from '@ant-design/icons';

import styles from './Settings.module.css';

import { useState } from 'react';

import ChangeBioModal from './ChangeBioModal';

import ChangeUserNameModal from './ChangeUserNameModal';
import ChangePassModal from './ChangePassModal';
import ChangeEmailModal from './ChangeEmailModal';

const Settings = () => {

    const [isBioModalOpen, setIsBioModalOpen] = useState(false);
    const [isUserNameModalOpen, setIsUserNameModalOpen] = useState(false);
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    const onChangeBioClick = () => setIsBioModalOpen(true);
    const onChangeUserNameClick = () => setIsUserNameModalOpen(true);
    const onChangePassClick = () => setIsPassModalOpen(true);
    const onChangeEmailClick = () => setIsEmailModalOpen(true);

    return (
        <>
            <div className={styles.settingsContainer}>

                <Typography.Title
                    level={3}
                    style={{
                        textAlign: 'left',
                        // marginBottom: '2.5rem',
                        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                        fontWeight: 700,
                        fontSize: '2rem',
                        letterSpacing: '0.4px',
                        color: '#1A7F64',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.6rem',
                        paddingLeft: '10rem',
                        width: '100%',
                        marginTop: '0'
                        // border: 'solid 1px red'
                    }}
                >
                    <span
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '50%',
                            padding: '0.5rem',
                            boxShadow: '0 3px 8px rgba(0, 0, 0, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <SettingFilled style={{ color: '#1A7F64', fontSize: '2rem' }} />
                    </span>
                    Account Settings
                </Typography.Title>

                <div className={styles.settingsFlex}>

                    <Card onClick={onChangeUserNameClick} hoverable className={styles.settingsCard}>
                        <UserOutlined className={styles.settingsIcon} />
                        <Typography.Title level={3} style={{ fontSize: '2rem', fontFamily: 'Poppins, sans-serif' }}>Change Username</Typography.Title>
                        <Typography.Paragraph style={{ fontSize: '1.5rem', fontStyle: 'italic', fontFamily: 'Poppins, sans-serif' }}>Customize the name others see on your profile.</Typography.Paragraph>


                    </Card>

                    <Card onClick={onChangePassClick} hoverable className={styles.settingsCard}>
                        <LockOutlined className={styles.settingsIcon} />
                        <Typography.Title level={3} style={{ fontSize: '2rem', fontFamily: 'Poppins, sans-serif' }}>Change Password</Typography.Title >
                        <Typography.Paragraph style={{ fontSize: '1.5rem', fontStyle: 'italic', fontFamily: 'Poppins, sans-serif' }}>Update your password regularly to stay protected.</Typography.Paragraph>
                    </Card>

                    <Card onClick={onChangeEmailClick} hoverable className={styles.settingsCard}>
                        <MailOutlined className={styles.settingsIcon} />
                        <Typography.Title level={3} style={{ fontSize: '2rem', fontFamily: 'Poppins, sans-serif' }}>Change Email</Typography.Title >
                        <Typography.Paragraph style={{ fontSize: '1.5rem', fontStyle: 'italic', fontFamily: 'Poppins, sans-serif' }}>Update your login email for better account security.</Typography.Paragraph>
                    </Card>

                    <Card onClick={onChangeBioClick} hoverable className={styles.settingsCard}>

                        <UserOutlined className={styles.settingsIcon} />

                        <Typography.Title level={3} style={{ fontSize: '2rem', fontFamily: 'Poppins, sans-serif' }}>Change Bio</Typography.Title>

                        <Typography.Paragraph style={{ fontSize: '1.5rem', fontStyle: 'italic', fontFamily: 'Poppins, sans-serif' }}>
                            Share a little about yourself — let others know what makes your journey unique.
                        </Typography.Paragraph>
                    </Card>

                </div>
            </div>

            <ChangeBioModal visible={isBioModalOpen} setVisible={setIsBioModalOpen} />
            <ChangeUserNameModal setVisible={setIsUserNameModalOpen} visible={isUserNameModalOpen} />
            <ChangePassModal setVisible={setIsPassModalOpen} visible={isPassModalOpen} />
            <ChangeEmailModal setVisible={setIsEmailModalOpen} visible={isEmailModalOpen} />

        </>
    );
};

export default Settings;