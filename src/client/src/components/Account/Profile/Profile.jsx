import coverImage from '../../../assets/cover.jpg';

import styles from './Profile.module.css';

import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { message, Upload, Card, Button, Tag, Dropdown, Menu } from 'antd';
import {
    LoadingOutlined,
    PlusOutlined,
    AppstoreOutlined,
    StarOutlined,
    SettingOutlined
} from '@ant-design/icons';

import { usersServiceFactory } from '../../../services/usersService';
import { AuthContext } from '../../../contexts/AuthContext';
import { fireError } from '../../../utils/fireError';
import { myPlacesPath } from '../../../constants/paths';

const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    return isJpgOrPng;
};

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [profileInfo, setProfileInfo] = useState({});
    const { token, userLogin } = useContext(AuthContext);
    const userService = usersServiceFactory(token);

    const settingsMenu = {
        items: [
            {
                key: '1',
                label: <Link to={myPlacesPath}>My Places</Link>
            },
            {
                key: '2',
                label: <Link to="/my-reviews">My Reviews</Link>
            }
        ]
    };

    useEffect(() => {
        userService
            .getProfileInfo()
            .then(res => setProfileInfo(res))
            .catch(err => console.log(err));
    }, []);

    const handleChange = info => {
        setProfileInfo(prev => ({ ...prev, profileImageUrl: '' }));
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

        userService.changeProfileImage(formData)
            .then(res => {
                const updatedUrl = `${res.imageUrl}?t=${Date.now()}`;
                setProfileInfo(prev => ({ ...prev, profileImageUrl: updatedUrl }));
                userLogin(login => ({ ...login, profileImageUrl: updatedUrl }));
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                fireError(err);
            });
    };

    return (
        <section className={styles.profilePage}>

            <div className={styles.coverWrapper}>
                <img src={coverImage} alt="Cover" className={styles.coverImage} />
            </div>

            <Card className={styles.profileCard}>
                <div className={styles.settingsButton}>
                    <Dropdown menu={settingsMenu} placement="bottomRight" trigger={['click']}>
                        <Button type="text" icon={<SettingOutlined style={{ fontSize: '20px' }} />} />
                    </Dropdown>
                </div>
                <div className={styles.profileContent}>

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
                                <div className={styles.avatarImageContainer}>
                                    <img
                                        src={profileInfo.profileImageUrl}
                                        alt="avatar"
                                        className={styles.avatarImage}
                                    />
                                    <div className={styles.avatarOverlay}>
                                        <span className={styles.avatarText}>Change</span>
                                    </div>
                                </div>
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

                    <div className={styles.userInfo}>
                        <h2>{profileInfo.userName}</h2>
                        <p>{profileInfo.email}</p>

                        <div className={styles.statRow}>

                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Contributions</span>
                                <span className={styles.statCount}>0</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Followers</span>
                                <span className={styles.statCount}>0</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Following</span>
                                <span className={styles.statCount}>0</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Points</span>
                                <span className={styles.statCount}>0</span>
                            </div>
                        </div>
                    </div>


                </div>
            </Card>
        </section>

    );
};

export default Profile;
