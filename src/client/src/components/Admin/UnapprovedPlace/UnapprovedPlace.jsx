import styles from './UnapprovedPlace.module.css';

import {
    Carousel,
    Card,
    Typography,
    Avatar,
    Rate,
    Tag,
    Flex,
    Spin,
    ConfigProvider,
    Button
} from 'antd';

import { UserOutlined, InfoCircleOutlined, CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { useState, useEffect, useContext } from 'react';

import { useLocation } from 'react-router-dom';

import { adminServiceFactory } from '../../../services/adminService';

import { AuthContext } from '../../../contexts/AuthContext';

import PlaceDetails from '../../PlaceDetails/PlaceDetails';

import PlaceDetailsSection from '../../PlaceDetails/PlaceDetailsSection/PlaceDetailsSection';

import { motion } from 'framer-motion';

import { fireError } from '../../../utils/fireError';

const UnapprovedPlace = () => {

    const { token } = useContext(AuthContext);
    const location = useLocation();

    const adminService = adminServiceFactory(token);

    const [place, setPlace] = useState();

    const [mapUrl, setMapUrl] = useState('');

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        if (location.state?.placeId) {

            adminService
                .getUnapprovedPlace(location.state?.placeId)
                .then(res => {

                    setPlace(res);

                    setIsLoading(false);

                    const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

                    setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${res.coordinates.latitude},${res.coordinates.longitude}`);

                }).catch(err => {
                    fireError(err);
                })
        }

    }, []);

    const approvalCardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    return (

        <>
            {
                isLoading ?
                    <ConfigProvider theme={{
                        components: {
                            Spin: {
                                colorPrimary: 'white'
                            }
                        }
                    }}>
                        <Spin spinning={isLoading} />
                    </ConfigProvider> :
                    (
                        <>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '2rem'
                            }}>
                                <div
                                    style={{
                                        backgroundColor: '#89ADFF',
                                        borderRadius: '999px',
                                        padding: '0.5rem 1.5rem',
                                        display: 'inline-block',
                                        margin: '0 auto',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    }}
                                >
                                    <Typography.Title
                                        level={3}
                                        style={{
                                            margin: 0,
                                            color: '#1f1e2f',
                                        }}
                                    >
                                        <CloseCircleOutlined style={{ color: 'red', marginRight: '5px' }} />Unapproved Place
                                    </Typography.Title>
                                </div>
                            </div>

                            {place && <PlaceDetailsSection isForAdmin={true} place={place} mapUrl={mapUrl} loading={false} />}

                            <Card
                                style={{
                                    margin: '2rem 3rem',
                                    backgroundColor: '#f6ffed',
                                    border: '1px solid #b7eb8f',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                    textAlign: 'center',
                                    padding: '2rem',
                                }}
                            >
                                <Typography.Title level={3} style={{ color: '#389e0d', marginBottom: '1rem' }}>
                                    Approve This Place?
                                </Typography.Title>
                                <Typography.Paragraph style={{ fontSize: '16px', color: '#4b5563', marginBottom: '2rem' }}>
                                    This place looks great! If everything checks out, go ahead and approve it for the community.
                                </Typography.Paragraph>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                    <Button
                                        type="primary"
                                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                        size="large"
                                        icon={<CheckOutlined />}
                                        onClick={() => console.log('Approve logic here')}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        danger
                                        size="large"
                                        icon={<UserOutlined />}
                                        onClick={() => console.log('Reject logic here')}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </Card>
                        </>
                    )
            }
        </>
    );
};

export default UnapprovedPlace;