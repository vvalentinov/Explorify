import styles from './Profile.module.css';

import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { message, Upload, Card, Button, Tag } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

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
                <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    customRequest={handleCustomUpload}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                >
                    {profileInfo.profileImageUrl ? (
                        <img
                            src={profileInfo.profileImageUrl}
                            alt="avatar"
                            style={{
                                width: 100,
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: '50%',
                                display: 'block',
                                margin: '0 auto'
                            }}
                        />
                    ) : (
                        <button
                            style={{ border: 0, background: 'none', cursor: 'pointer' }}
                            type="button"
                        >
                            {
                                loading ? (
                                    <>
                                        <LoadingOutlined />
                                        <div style={{ marginTop: 8 }}>Uploading...</div>
                                    </>
                                ) : (
                                    <>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Avatar</div>
                                    </>
                                )
                            }
                        </button>
                    )}
                </Upload>

                <div className={styles.userInfo}>
                    <h2>{profileInfo.userName}</h2>
                    <p>{profileInfo.email}</p>

                    <div className={styles.tagsContainer}>
                        <Tag >{profileInfo.uploadedPlacesCount} Places</Tag>
                        <Tag >{profileInfo.uploadedReviewsCount} Reviews</Tag>
                    </div>
                </div>

                {/* Buttons */}
                <div className={styles.profileActions}>
                    <Link to={myPlacesPath}>
                        <Button className={styles.profileActionsBtn}>
                            My Places
                        </Button>
                    </Link>
                    <Link to="/my-reviews">
                        <Button className={styles.profileActionsBtn}>
                            My Reviews
                        </Button>
                    </Link>
                </div>

            </Card>

        </section>
    );
};
export default Profile;