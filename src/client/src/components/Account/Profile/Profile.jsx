import coverImage from '../../../assets/cover.jpg';

import styles from './Profile.module.css';

import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Upload, Card, Button, Dropdown, App } from 'antd';
import {
    LoadingOutlined,
    PlusOutlined,
    SettingOutlined,
    EnvironmentOutlined,
    StarOutlined,
    UsergroupAddOutlined,
    HeartOutlined,
    LockFilled
} from '@ant-design/icons';

import { fireError } from '../../../utils/fireError';

import { usersServiceFactory } from '../../../services/usersService';
import { AuthContext } from '../../../contexts/AuthContext';
import { myPlacesPath } from '../../../constants/paths';

import { useLocation } from 'react-router-dom';

import BadgesSection from './BadgesSection';

const Profile = () => {

    const location = useLocation();

    const { message } = App.useApp();

    const { token, userLogin, isAuthenticated, userId } = useContext(AuthContext);

    const userService = usersServiceFactory(token);

    const [uploadingPic, setUploadingPic] = useState(false);
    const [profileInfo, setProfileInfo] = useState({});
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    const [isFollowBtnDisabled, setIsFollowBtnDisabled] = useState(false);

    const isOwnProfile = profileInfo?.userId === userId;

    const beforeUpload = file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        return isJpgOrPng;
    };

    const settingsMenu = {
        items: [
            {
                key: '4',
                label: (
                    <Link to="/account/settings" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <SettingOutlined />
                        Settings
                    </Link>
                )
            },
            {
                key: '1',
                label: (
                    <Link to={myPlacesPath} style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <EnvironmentOutlined />
                        My Places
                    </Link>
                )
            },
            {
                key: '2',
                label: (
                    <Link to="/my-reviews" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <StarOutlined />
                        My Reviews
                    </Link>
                )
            },
            {
                key: '3',
                label: (
                    <Link to="/my-following" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UsergroupAddOutlined />
                        My Following
                    </Link>
                )
            },
            {
                key: '5',
                label: (
                    <Link to="/favorite-places" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <HeartOutlined />
                        Favorite Places
                    </Link>
                )
            }
        ]
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
                    <img src={coverImage} alt="Cover" className={styles.coverImage} />
                </div>


                <Card className={styles.profileCard}>
                    {isOwnProfile && (
                        <div className={styles.settingsButton}>
                            <Dropdown menu={settingsMenu} placement="bottom" trigger={['click']}>
                                <Button type="text" icon={<SettingOutlined style={{ fontSize: '30px' }} />} />
                            </Dropdown>
                        </div>
                    )}

                    <div className={styles.profileContent}>

                        <div className={styles.avatarWrapper}>
                            {isOwnProfile ?
                                <Upload
                                    name="avatar"
                                    listType="picture-circle"
                                    showUploadList={false}
                                    customRequest={handleCustomUpload}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                >
                                    {loadingProfile ? (
                                        <div className={styles.avatarPlaceholder}>
                                            <LoadingOutlined style={{ fontSize: 32 }} spin />
                                        </div>
                                    ) : profileInfo.profileImageUrl ? (
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
                                            {uploadingPic ? (
                                                <>
                                                    <LoadingOutlined style={{ fontSize: 24 }} spin />
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
                                </Upload> :
                                <div className={styles.avatarImageContainer}>
                                    <img
                                        src={profileInfo.profileImageUrl}
                                        alt="avatar"
                                        className={styles.avatarImage}
                                    />
                                </div>
                            }

                            {isAuthenticated && profileInfo.userId !== userId && profileInfo && (
                                <Button
                                    disabled={isFollowBtnDisabled}
                                    ghost={!isFollowing}
                                    onClick={handleFollowToggle}
                                    className={styles.followButton}
                                    variant='solid'
                                    color='cyan'
                                >
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </Button>
                            )}

                        </div>

                        <div className={styles.userInfo}>
                            <h2>{profileInfo.userName}</h2>

                            <div className={styles.bioBox}>
                                <p className={styles.bioPlaceholder}>
                                    This explorer hasn’t written a bio yet. 🌱
                                    <br />
                                    <span style={{ fontStyle: 'italic', fontSize: '1.3rem' }}>
                                        Maybe they’re too busy traveling the world...
                                    </span>
                                </p>
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
                </Card>


            </section>

            <BadgesSection />
        </>

    );
};

export default Profile;
