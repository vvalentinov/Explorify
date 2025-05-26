import styles from './Places.module.css';

import PlacesList from '../../PlacesList/PlacesList';

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useContext } from 'react';

import { AuthContext } from '../../../contexts/AuthContext';

import { adminServiceFactory } from '../../../services/adminService';
import { placesServiceFactory } from '../../../services/placesService';

import { Pagination, ConfigProvider, Spin, Card, Typography, Radio, Empty } from 'antd';

import { EnvironmentOutlined } from '@ant-design/icons';

import { motion } from 'framer-motion';

import { fireError } from '../../../utils/fireError';

const options = [
    { label: 'Approved', value: 'approved' },
    { label: 'Unapproved', value: 'unapproved' },
    { label: 'Recently Deleted', value: 'recentlyDeleted' },
];

const Places = () => {

    const { token } = useContext(AuthContext);

    const adminService = adminServiceFactory(token);
    const placeService = placesServiceFactory(token);

    // State Management
    const [places, setPlaces] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [filter, setFilter] = useState('approved');
    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPlaces = async () => {

        setSpinnerLoading(true);

        try {

            let response;

            if (filter === 'approved') {
                // response = await adminService.getApprovedPlaces(currentPage);
                response = await placeService.getApproved(currentPage, true);
            } else if (filter === 'unapproved') {
                // response = await adminService.getUnapprovedPlaces(currentPage);
                response = await placeService.getUnapproved(currentPage, true);
            } else if (filter === 'recentlyDeleted') {
                // response = await adminService.getDeletedPlaces(currentPage);
                response = await placeService.getDeleted(currentPage, true);
            }

            setPagesCount(response.pagination.pagesCount);
            setPlaces(response.places);
            setSpinnerLoading(false);

        } catch (err) {
            fireError(err);
            setSpinnerLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, [filter, currentPage]);

    useEffect(() => {

        if (places.length > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    }, [places]);

    const handlePageChange = (page) => setCurrentPage(page);
    const handleSortChange = (e) => {
        setCurrentPage(1);
        setFilter(e.target.value);
    };

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                }}
            >
                <Card
                    style={{
                        width: '60%',
                        padding: '1rem 2rem',
                        backgroundColor: '#f3e9fe',
                        border: '1px solid #9c4dcc',
                        borderRadius: '16px',
                        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center',
                        marginTop: '2rem'
                    }}
                >
                    <ConfigProvider
                        theme={{
                            components: {
                                Radio: {
                                    colorPrimary: '#9c4dcc',
                                    buttonBg: '#e6d4f5',
                                    buttonColor: '#6a2c91',
                                    buttonSolidCheckedBg: '#9c4dcc',
                                    buttonSolidCheckedColor: 'white',
                                    buttonSolidCheckedHoverBg: '#8a3dac',
                                    buttonSolidCheckedActiveBg: '#9c4dcc',
                                    borderRadius: 12,
                                },
                            },
                        }}
                    >
                        <Typography.Paragraph italic={true}>
                            Filter Places
                        </Typography.Paragraph>

                        <Radio.Group
                            options={options}
                            defaultValue={filter}
                            optionType="button"
                            value={filter}
                            buttonStyle="solid"
                            size="large"
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '1rem',
                                flexWrap: 'wrap',
                            }}
                            onChange={handleSortChange}
                            name='Sort'
                        />
                    </ConfigProvider>
                </Card>
            </div>

            {
                spinnerLoading ?
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 'calc(100vh - 63px)'
                    }}>
                        <ConfigProvider theme={{
                            components: {
                                Spin: {
                                    colorPrimary: 'white'
                                }
                            }
                        }}>
                            <Spin size='large' spinning={spinnerLoading} />
                        </ConfigProvider>
                    </div> :
                    <>
                        {places?.length > 0 ?

                            <PlacesList isForAdmin={true} places={places} /> :

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        width: '100%',
                                        marginTop: '1rem'
                                    }}>
                                    <Card
                                        style={{
                                            textAlign: 'center',
                                            backgroundColor: '#f0fff4',
                                            borderRadius: '16px',
                                            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.05)',
                                            border: '1px solid #b7eb8f',
                                            width: '60%'
                                        }}
                                    >
                                        <Empty
                                            image={<EnvironmentOutlined style={{ fontSize: '50px', color: '#52c41a' }} />}
                                            styles={{
                                                image: {
                                                    marginBottom: '8px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }
                                            }}
                                            description={
                                                <div style={{ fontSize: '18px', fontWeight: 600, color: '#389e0d' }}>
                                                    No places here yet!
                                                </div>
                                            }
                                        />
                                    </Card>
                                </div>

                            </motion.div>
                        }

                        {pagesCount > 1 &&
                            <ConfigProvider>
                                <Pagination
                                    align='center'
                                    onChange={handlePageChange}
                                    current={currentPage}
                                    total={pagesCount * 6}
                                    pageSize={6}
                                    style={{ textAlign: 'center', marginBottom: '1rem' }}
                                    className={styles.customPagination}
                                />
                            </ConfigProvider>
                        }
                    </>
            }
        </>
    );
};

export default Places;