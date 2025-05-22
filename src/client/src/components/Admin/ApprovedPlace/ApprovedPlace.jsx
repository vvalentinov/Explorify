import styles from './ApprovedPlace.module.css';

import {
    Card,
    Typography,
    Spin,
    ConfigProvider,
    Button,
    Divider
} from 'antd';

import { CheckOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';

import { useState, useEffect, useContext } from 'react';

import { useLocation } from 'react-router-dom';

import { adminServiceFactory } from '../../../services/adminService';

import { placesServiceFactory } from '../../../services/placesService';

import { AuthContext } from '../../../contexts/AuthContext';

import PlaceDetails from '../../PlaceDetails/PlaceDetails';

import PlaceDetailsSection from '../../PlaceDetails/PlaceDetailsSection/PlaceDetailsSection';

import { motion } from 'framer-motion';

import { fireError } from '../../../utils/fireError';

const ApprovedPlace = () => {

    const { token } = useContext(AuthContext);

    const location = useLocation();

    // const adminService = adminServiceFactory(token);

    const placeService = placesServiceFactory(token);

    const [place, setPlace] = useState();

    const [mapUrl, setMapUrl] = useState('');

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        if (location.state?.placeId) {

            placeService
                .getPlaceDetailsById(location.state?.placeId)
                .then(res => {
                    setPlace(res);

                    setIsLoading(false);

                    const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

                    setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${res.coordinates.latitude},${res.coordinates.longitude}`);
                }).catch(err => {
                    fireError(err);
                });
        }

    }, []);

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
                                        <CheckOutlined style={{ color: 'green', marginRight: '5px' }} />Approved Place
                                    </Typography.Title>
                                </div>
                            </div>

                            {place && <PlaceDetailsSection isForAdmin={true} place={place} mapUrl={mapUrl} loading={false} />}

                            <Card
                                style={{
                                    margin: '2rem 3rem',
                                    backgroundColor: '#fff1f0',
                                    border: '1px solid #ffa39e',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                    textAlign: 'center',
                                    padding: '2rem',
                                }}
                            >
                                <Typography.Title level={3} style={{ color: '#cf1322', marginBottom: '1rem' }}>
                                    Unapprove This Place?
                                </Typography.Title>
                                <Typography.Paragraph style={{ fontSize: '16px', color: '#4b5563', marginBottom: '2rem' }}>
                                    If you've changed your mind or found an issue with this place, you can unapprove it. This will remove it from public listings.
                                </Typography.Paragraph>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        danger
                                        size="large"
                                        icon={<CloseCircleOutlined />}
                                        style={{
                                            padding: '0 2rem',
                                            boxShadow: '0 4px 10px rgba(255, 77, 79, 0.3)',
                                            borderRadius: '999px',
                                        }}
                                        onClick={() => console.log('Unapprove logic here')}
                                    >
                                        Unapprove
                                    </Button>
                                </div>

                                <Divider size='large' />

                                <Typography.Title level={3} style={{ color: '#cf1322', marginBottom: '1rem' }}>
                                    Delete This Place?
                                </Typography.Title>
                                <Typography.Paragraph style={{ fontSize: '16px', color: '#4b5563', marginBottom: '2rem' }}>
                                    If you've changed your mind or found an issue with this place, you can delete it. This action is irreversible and will delete the place.
                                </Typography.Paragraph>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <Button
                                        danger
                                        size="large"
                                        icon={<DeleteOutlined />}
                                        style={{
                                            backgroundColor: '#a8071a',
                                            borderColor: '#a8071a',
                                            color: '#fff',
                                            padding: '0 2rem',
                                            boxShadow: '0 4px 10px rgba(168, 7, 26, 0.3)',
                                            borderRadius: '999px',
                                        }}
                                        onClick={() => console.log('Delete logic here')}
                                    >
                                        Delete
                                    </Button>
                                </div>

                            </Card>

                        </>
                    )
            }
        </>
    );
};

export default ApprovedPlace;