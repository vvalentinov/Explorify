import styles from './Profile.module.css';

import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { message, Upload, Card, Button, Tag, ConfigProvider } from 'antd';
import {
    LoadingOutlined,
    PlusOutlined,
    AppstoreOutlined,
    StarOutlined,
    UserOutlined,
    LockOutlined,
    MailOutlined,
    SafetyOutlined,
} from '@ant-design/icons';

import { usersServiceFactory } from '../../services/usersService';

import { AuthContext } from '../../contexts/AuthContext';

import { fireError } from '../../utils/fireError';

import { myPlacesPath } from '../../constants/paths';

const beforeUpload = file => {

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }

    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //     message.error('Image must smaller than 2MB!');
    // }
    // return isJpgOrPng && isLt2M;

    return isJpgOrPng;
};

import {
    changePasswordPath,
    changeUsernamePath,
    changeEmailPath,
} from "../../constants/paths";

const settingsSections = [
    {
        title: "Change Username",
        buttonText: "Update Username",
        link: changeUsernamePath,
        color: "#f6ffed",
        description:
            "Your username is visible to others across the platform. Updating it allows you to personalize your identity, making it easier for others to find or recognize your contributions. Choose a name that reflects you.",
    },
    {
        title: "Change Password",
        buttonText: "Update Password",
        link: changePasswordPath,
        color: "#e6f7ff",
        description:
            "It’s important to use a strong password and update it regularly to keep your account secure. Choose something unique, and don’t reuse passwords from other services. This helps protect your data and identity.",
    },
    {
        title: "Change Email",
        buttonText: "Update Email",
        link: changeEmailPath,
        color: "#fffbe6",
        description:
            "Your email is used for login and receiving important updates. If you’ve changed your primary email or want to ensure you're reachable, update your address here. We'll always keep it private.",
    }
];


const Profile = () => {

    const [loading, setLoading] = useState(false);
    const [profileInfo, setProfileInfo] = useState({});

    const { token, userLogin } = useContext(AuthContext);

    const userService = usersServiceFactory(token);

    useEffect(() => {
        userService
            .getProfileInfo()
            .then(res => setProfileInfo(res))
            .catch(err => console.log(err));
    }, []);

    const handleChange = info => {

        setProfileInfo(prevProfileInfo => ({
            ...prevProfileInfo,
            profileImageUrl: '',
        }));

        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            setLoading(false);
        }
    };

    const handleCustomUpload = ({ file }) => {

        const formData = new FormData();
        formData.append("image", file);

        userService
            .changeProfileImage(formData)
            .then(res => {

                setProfileInfo(prevProfileInfo => ({
                    ...prevProfileInfo,
                    profileImageUrl: `${res.imageUrl}?t=${Date.now()}`,
                }));

                setLoading(false);

                userLogin(login => ({
                    ...login,
                    profileImageUrl: `${res.imageUrl}?t=${Date.now()}`,
                }));

            })
            .catch(err => {
                setLoading(false);
                fireError(err);
            });
    };

    return (
        <section className={styles.profileCardSection}>

            <Card title="Profile Card" className={styles.profileCard}>

                <div className={styles.profileHeader}>
                    <div className={styles.avatarWrapper}>
                        <Upload
                            name="avatar"
                            listType="picture-circle"
                            showUploadList={false}
                            customRequest={handleCustomUpload}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {profileInfo.profileImageUrl ? (
                                <img
                                    src={profileInfo.profileImageUrl}
                                    alt="avatar"
                                    className={styles.avatarImage}
                                />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {loading ? (
                                        <>
                                            <LoadingOutlined style={{ fontSize: 24 }} />
                                            <div>Uploading...</div>
                                        </>
                                    ) : (
                                        <>
                                            <PlusOutlined style={{ fontSize: 24 }} />
                                            <div>Upload</div>
                                        </>
                                    )}
                                </div>
                            )}
                        </Upload>
                    </div>

                    <div className={styles.userDetails}>
                        <h2 className={styles.username}>{profileInfo.userName}</h2>
                        <p className={styles.email}>{profileInfo.email}</p>
                        <div className={styles.tags}>
                            <Tag color="green">{profileInfo.uploadedPlacesCount} Places</Tag>
                            <Tag color="blue">{profileInfo.uploadedReviewsCount} Reviews</Tag>
                        </div>

                        <div className={styles.profileActions}>
                            <Link to={myPlacesPath}>
                                <Button
                                    style={{
                                        backgroundColor: 'green',
                                        color: '#fff',
                                        fontWeight: 600,
                                        border: 'none',
                                        height: '42px',
                                        fontSize: '1rem',
                                        transition: 'background-color 0.3s ease',
                                        padding: '0 2rem'
                                    }}
                                    icon={<AppstoreOutlined />}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'lightgreen'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'green'}
                                // className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                >
                                    My Places
                                </Button>

                            </Link>

                            <Link to="/my-reviews">
                                <Button
                                    icon={<StarOutlined />}
                                    className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                                >
                                    My Reviews
                                </Button>
                            </Link>
                        </div>

                    </div>
                </div>

                <div className={styles.settingsGrid}>
                    {settingsSections.map((section) => (
                        <Card
                            key={section.title}
                            style={{
                                width: '100%',
                                marginTop: '1.5rem',
                                backgroundColor: section.color,
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                padding: '1.5rem 2rem',
                            }}
                            styles={{
                                header: {
                                    fontSize: '1.25rem',
                                    fontWeight: 600,
                                    paddingLeft: 0,
                                    borderBottom: 'none',
                                },
                                body: {
                                    textAlign: 'center',
                                    padding: '0'
                                }
                            }}
                            title={section.title}
                        >
                            <p style={{
                                fontSize: '1.05rem',
                                lineHeight: 1.65,
                                color: '#444',
                                marginBottom: '1.5rem'
                            }}>
                                {section.description}
                            </p>

                            <Link to={section.link}>
                                <Button
                                    // block
                                    style={{
                                        backgroundColor: '#9c4dcc',
                                        color: '#fff',
                                        fontWeight: 600,
                                        border: 'none',
                                        height: '42px',
                                        fontSize: '1rem',
                                        transition: 'background-color 0.3s ease',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#8a3dac'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#9c4dcc'}
                                >
                                    {section.buttonText}
                                </Button>
                            </Link>
                        </Card>
                    ))}
                </div>

            </Card>

        </section>
    );
};
export default Profile;