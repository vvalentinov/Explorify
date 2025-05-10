import { useState, useContext, useEffect } from 'react';

import { message, Upload, Card } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import { usersServiceFactory } from '../../services/usersService';

import { AuthContext } from '../../contexts/AuthContext';

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
                console.log(err);
                setLoading(false);
            });
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: "center",
            minHeight: 'calc(100vh - 63px)',
        }}>
            <Card
                title="Profile Card"
                style={{
                    width: '50%',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: 16,
                    margin: '2rem auto',
                }}
            >
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
            </Card>
        </div>
    );
};
export default Profile;