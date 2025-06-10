import { Card, Button, Typography } from 'antd';

import {
    MailOutlined,
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';

import { Link } from 'react-router-dom';

import styles from './Settings.module.css';

import {
    changeEmailPath,
    changePasswordPath,
    changeUsernamePath
} from '../../../constants/paths';

import { useState, useContext, useEffect } from 'react';

import ChangeBioModal from './ChangeBioModal';

import { usersServiceFactory } from '../../../services/usersService';

import { AuthContext } from '../../../contexts/AuthContext';

const Settings = () => {

    const [isBioModalOpen, setIsBioModalOpen] = useState(false);

    const onChangeBioClick = () => setIsBioModalOpen(true);

    const { token } = useContext(AuthContext);

    const userService = usersServiceFactory(token);

    const [userBio, setUserBio] = useState('');

    useEffect(() => {
        userService
            .getUserBio()
            .then(res => {
                setUserBio(res.bio);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            <div className={styles.settingsContainer}>

                <Typography.Title
                    level={3}
                    style={{ fontFamily: 'Poppins, sans-serif', marginTop: '10px' }}
                    className={styles.settingsTitle}>
                    Account Settings
                </Typography.Title>

                <div className={styles.settingsFlex}>

                    <Card className={styles.settingsCard}>
                        <MailOutlined className={styles.settingsIcon} />
                        <Typography.Title level={3} style={{ fontSize: '2rem', fontFamily: 'Poppins, sans-serif' }}>Change Email</Typography.Title >
                        <Typography.Paragraph style={{ fontSize: '1.5rem', fontStyle: 'italic', fontFamily: 'Poppins, sans-serif' }}>Update your login email for better account security.</Typography.Paragraph>
                        <Link to={changeEmailPath}>
                            <Button style={{ fontSize: '2rem', padding: '2rem 0', borderRadius: '15px' }} variant='solid' color='cyan' block>Change Email</Button>
                        </Link>
                    </Card>

                    <Card className={styles.settingsCard}>
                        <LockOutlined className={styles.settingsIcon} />
                        <Typography.Title level={3} style={{ fontSize: '2rem', fontFamily: 'Poppins, sans-serif' }}>Change Password</Typography.Title >
                        <Typography.Paragraph style={{ fontSize: '1.5rem', fontStyle: 'italic', fontFamily: 'Poppins, sans-serif' }}>Update your password regularly to stay protected.</Typography.Paragraph>
                        <Link to={changePasswordPath}>
                            <Button style={{ fontSize: '2rem', padding: '2rem 0', borderRadius: '15px' }} variant='solid' color='cyan' block>Change Password</Button>
                        </Link>
                    </Card>

                    <Card className={styles.settingsCard}>
                        <UserOutlined className={styles.settingsIcon} />
                        <Typography.Title level={3} style={{ fontSize: '2rem', fontFamily: 'Poppins, sans-serif' }}>Change Username</Typography.Title>
                        <Typography.Paragraph style={{ fontSize: '1.5rem', fontStyle: 'italic', fontFamily: 'Poppins, sans-serif' }}>Customize the name others see on your profile.</Typography.Paragraph>
                        <Link to={changeUsernamePath}>
                            <Button style={{ fontSize: '2rem', padding: '2rem 0', borderRadius: '15px' }} variant='solid' color='cyan' block>Change Username</Button>
                        </Link>
                    </Card>

                    <Card className={styles.settingsCard}>

                        <UserOutlined className={styles.settingsIcon} />

                        <Typography.Title level={3} style={{ fontSize: '2rem', fontFamily: 'Poppins, sans-serif' }}>Change Bio</Typography.Title>

                        <Typography.Paragraph style={{ fontSize: '1.5rem', fontStyle: 'italic', fontFamily: 'Poppins, sans-serif' }}>
                            Share a little about yourself — let others know what makes your journey unique.
                        </Typography.Paragraph>

                        {/* <Link to={changeUsernamePath}> */}
                        <Button
                            onClick={onChangeBioClick}
                            style={{ fontSize: '2rem', padding: '2rem 0', borderRadius: '15px' }}
                            variant='solid'
                            color='cyan'
                            block
                        >
                            Change Bio
                        </Button>
                        {/* </Link> */}
                    </Card>

                </div>
            </div>

            <ChangeBioModal userBio={userBio} visible={isBioModalOpen} setVisible={setIsBioModalOpen} />

        </>
    );
};

export default Settings;