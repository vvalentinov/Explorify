import styles from './MyPlaces.module.css';

import { usersServiceFactory } from "../../services/usersService";
import { placesServiceFactory } from '../../services/placesService';

import { useState, useEffect, useContext, useLayoutEffect } from "react";

import { AuthContext } from '../../contexts/AuthContext';

import { fireError } from "../../utils/fireError";

import { motion } from 'framer-motion';

import { Pagination, Spin, ConfigProvider, Card, Button, Modal, App, Typography, Radio, Empty } from "antd";

import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, SmileOutlined, EnvironmentOutlined } from '@ant-design/icons';

import { useNavigate, Link } from 'react-router-dom';

import PlacesList from '../PlacesList/PlacesList';

const options = [
    { label: 'Approved', value: 'approved' },
    { label: 'Unapproved', value: 'unapproved' },
    { label: 'Recently Deleted', value: 'recentlyDeleted' },
];

const MyPlaces = () => {

    const { token } = useContext(AuthContext);

    const userService = usersServiceFactory(token);
    const placesService = placesServiceFactory(token);

    const [places, setPlaces] = useState([]);
    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [spinnerLoading, setSpinnerLoading] = useState(false);

    const [filter, setFilter] = useState('approved');

    const fetchPlaces = async () => {

        setSpinnerLoading(true);

        try {

            let response;

            if (filter === 'approved') {
                response = await placesService.getApproved(currentPage, false);
            } else if (filter === 'unapproved') {
                response = await placesService.getUnapproved(currentPage, false);
            } else if (filter === 'recentlyDeleted') {
                response = await placesService.getDeleted(currentPage, false);
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
        setFilter(e.target.value);
        setCurrentPage(1);
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
                                    colorPrimary: 'green'
                                }
                            }
                        }}>
                            <Spin size='large' spinning={spinnerLoading} />
                        </ConfigProvider>
                    </div> :
                    <>
                        {places?.length > 0 ?
                            <PlacesList places={places} /> :
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
                            <ConfigProvider theme={{
                                components: {
                                    Pagination: {
                                        itemActiveBg: '#e8fffb',
                                        itemActiveColor: '#52c41a',
                                        colorPrimary: '#52c41a',
                                        colorPrimaryHover: '#389e0d',
                                    },
                                }
                            }}>
                                <Pagination
                                    align='center'
                                    onChange={handlePageChange}
                                    current={currentPage}
                                    total={pagesCount * 6}
                                    pageSize={6}
                                    style={{ textAlign: 'center', marginBottom: '1rem' }}
                                />
                            </ConfigProvider>
                        }
                    </>
            }
        </>
    );
};

export default MyPlaces;