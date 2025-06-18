import coverImage from '../../../assets/cover.jpg';

import styles from './Profile.module.css';

import { useState, useContext, useEffect } from 'react';

import { Upload, Card, Button, App, Skeleton, Avatar } from 'antd';
import {
    LoadingOutlined,
    PlusOutlined,
    SettingOutlined,
    UserOutlined
} from '@ant-design/icons';

import { fireError } from '../../../utils/fireError';

import { usersServiceFactory } from '../../../services/usersService';
import { AuthContext } from '../../../contexts/AuthContext';

import { useLocation, useNavigate } from 'react-router-dom';

import BadgesSection from './BadgesSection';

const Profile = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { message } = App.useApp();

    const { token, userLogin, isAuthenticated, userId, profileImageUrl } = useContext(AuthContext);

    const userService = usersServiceFactory(token);

    const [uploadingPic, setUploadingPic] = useState(false);
    const [profileInfo, setProfileInfo] = useState({});
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    const [isCoverLoaded, setIsCoverLoaded] = useState(false);

    const [isFollowBtnDisabled, setIsFollowBtnDisabled] = useState(false);

    const isOwnProfile = profileInfo?.userId === userId;

    const beforeUpload = file => {

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/bmp',
            'image/svg+xml'
        ];

        const isAllowed = allowedTypes.includes(file.type);

        if (!isAllowed) {
            message.error('You can only upload image files (JPG, PNG, WebP, GIF, BMP, SVG)!');
        }

        return isAllowed;
    };

    useEffect(() => {
        const stateUserId = location.state?.userId ?? null;

        setLoadingProfile(true);

        userService
            .getProfileInfo(stateUserId)
            .then(res => setProfileInfo(res))
            .catch(err => fireError(err))
            .finally(() => setLoadingProfile(false));

    }, [location.pathname, location.state?.userId]);

    const handleChange = info => {
        setProfileInfo(prev => ({ ...prev, profileImageUrl: '' }));
        if (info.file.status === 'uploading') {
            setUploadingPic(true);
            return;
        }
        if (info.file.status === 'done') {
            setUploadingPic(false);
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
                setUploadingPic(false);
            })
            .catch(err => {
                setUploadingPic(false);
                fireError(err);
            });
    };

    const [hasToggledFollow, setHasToggledFollow] = useState(false);

    useEffect(() => {
        if (!hasToggledFollow && profileInfo?.isFollowedByCurrentUser !== undefined) {
            setIsFollowing(profileInfo.isFollowedByCurrentUser);
        }
    }, [profileInfo, hasToggledFollow]);

    const handleFollowToggle = () => {
        if (isFollowBtnDisabled) return;

        setIsFollowBtnDisabled(true);
        const newIsFollowing = !isFollowing;
        const action = newIsFollowing ? userService.followUser : userService.unfollowUser;

        action(profileInfo.userId)
            .then(() => {
                setHasToggledFollow(true);
                setIsFollowing(newIsFollowing);
                setProfileInfo(prev => ({
                    ...prev,
                    followersCount: prev.followersCount + (newIsFollowing ? 1 : -1),
                }));
                message.success(newIsFollowing ? 'Followed' : 'Unfollowed');
            })
            .catch(fireError)
            .finally(() => {
                setIsFollowBtnDisabled(false);
            });
    };

    return (
        <>
            <section className={styles.profilePage}>

                <div className={styles.coverWrapper}>
                    <img
                        src={coverImage}
                        alt="Cover"
                        className={`${styles.coverImage} ${isCoverLoaded ? styles.loaded : ''}`}
                        onLoad={() => setIsCoverLoaded(true)}
                    />
                </div>

                <Card className={styles.profileCard}>

                    {isOwnProfile && (
                        <Button
                            onClick={() => navigate('/account/settings')}
                            type="text"
                            className={styles.settingsButton}
                            icon={<SettingOutlined style={{ fontSize: '35px' }} />}
                        />
                    )}


                    <div style={{ display: 'flex', alignItems: 'center', height: '400px' }}>
                        <div className={styles.profileContent}>
                            <div className={styles.avatarWrapper}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    {loadingProfile ? (
                                        <Skeleton.Avatar
                                            active
                                            size={100}
                                            shape="circle"
                                            className={styles.avatarSkeleton}
                                        />
                                    ) : isOwnProfile ? (
                                        <Upload
                                            name="avatar"
                                            listType="picture-circle"
                                            showUploadList={false}
                                            customRequest={handleCustomUpload}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                        >
                                            {profileImageUrl ? (
                                                <div className={styles.avatarImageContainer}>
                                                    <img
                                                        src={profileImageUrl}
                                                        alt="avatar"
                                                        className={styles.avatarImage}
                                                    />
                                                    <div className={styles.avatarOverlay}>
                                                        <span className={styles.avatarText}>Change</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Avatar
                                                    size={100}
                                                    icon={<UserOutlined />}
                                                    style={{ backgroundColor: '#d9d9d9' }}
                                                />
                                            )}
                                        </Upload>
                                    ) : (
                                        profileInfo.profileImageUrl ? (
                                            <div className={styles.avatarImageContainer}>
                                                <img
                                                    src={profileInfo.profileImageUrl}
                                                    alt="avatar"
                                                    className={styles.avatarImage}
                                                />
                                            </div>
                                        ) : (
                                            <Avatar
                                                size={100}
                                                icon={<UserOutlined />}
                                                style={{ backgroundColor: '#d9d9d9' }}
                                            />
                                        )
                                    )}
                                </div>

                                <h2 className={styles.usernameText}>{profileInfo.userName}</h2>

                                {isAuthenticated && profileInfo.userId !== userId && profileInfo && (
                                    <Button
                                        disabled={isFollowBtnDisabled}
                                        onClick={handleFollowToggle}
                                        className={styles.followButton}
                                    >
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </Button>
                                )}
                            </div>

                            <div className={styles.userInfo}>
                                <div className={styles.bioBox}>
                                    {profileInfo.bio && profileInfo.bio.trim() !== '' ? (
                                        <p className={styles.bioText}>{profileInfo.bio}</p>
                                    ) : (
                                        <div style={{ fontSize: '2rem' }}>
                                            This explorer hasn’t written a bio yet. 🌱<br />
                                            <span style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>
                                                Maybe they’re too busy traveling the world...
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <p>{profileInfo.email}</p>

                                <div className={styles.statRow}>
                                    <div className={styles.statBox}>
                                        <span className={styles.statLabel}>Contributions</span>
                                        <span className={styles.statCount}>{profileInfo.contributions}</span>
                                    </div>
                                    <div className={styles.statBox}>
                                        <span className={styles.statLabel}>Followers</span>
                                        <span className={styles.statCount}>{profileInfo.followersCount}</span>
                                    </div>
                                    <div className={styles.statBox}>
                                        <span className={styles.statLabel}>Following</span>
                                        <span className={styles.statCount}>{profileInfo.followingCount}</span>
                                    </div>
                                    <div className={styles.statBox}>
                                        <span className={styles.statLabel}>Points</span>
                                        <span className={styles.statCount}>{profileInfo.points}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                </Card>

            </section>

            <BadgesSection userId={location.state?.userId ?? userId} isOwnProfile={isOwnProfile} />
        </>

    );
};

export default Profile;
