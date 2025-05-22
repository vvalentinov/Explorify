import styles from './ApprovedPlaces.module.css';

import { useState, useEffect } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import { useContext } from 'react';

import { AuthContext } from '../../../contexts/AuthContext';

import { adminServiceFactory } from '../../../services/adminService';

import { Pagination, ConfigProvider, Spin, Card, Typography } from 'antd';

import { UserOutlined, InfoCircleOutlined, CheckOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';

import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ApprovedPlaces = () => {

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const adminService = adminServiceFactory(token);

    const [places, setPlaces] = useState([]);

    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsCount, setRecordsCount] = useState(0);
    const [spinnerLoading, setSpinnerLoading] = useState(false);

    useEffect(() => {

        setSpinnerLoading(true);

        const MIN_SPINNER_TIME = 1000;
        const startTime = Date.now();

        adminService
            .getApprovedPlaces(currentPage)
            .then(res => {

                const elapsed = Date.now() - startTime;
                const remaining = MIN_SPINNER_TIME - elapsed;

                setTimeout(() => {
                    setPagesCount(res.pagination.pagesCount);
                    setRecordsCount(res.pagination.recordsCount);
                    setPlaces(res.places);
                    setSpinnerLoading(false);
                    // setShouldScroll(true);
                }, remaining > 0 ? remaining : 0);
            }).catch(err => console.log(err));

    }, []);

    const handlePageChange = (page) => {

        setCurrentPage(page);
        setSpinnerLoading(true);

        const MIN_SPINNER_TIME = 1000;
        const startTime = Date.now();

        adminService
            .getApprovedPlaces(page)
            .then(res => {

                const elapsed = Date.now() - startTime;
                const remaining = MIN_SPINNER_TIME - elapsed;

                setTimeout(() => {
                    setPlaces(res.places);
                    setSpinnerLoading(false);
                    setPagesCount(res.pagination.pagesCount);
                    // setShouldScroll(true);
                }, remaining > 0 ? remaining : 0);
            }).catch(err => console.log(err));
    };

    return (
        <>
            {spinnerLoading ?
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
                                <CheckOutlined style={{ color: 'green', marginRight: '5px' }} />
                                Approved Places: {recordsCount}
                            </Typography.Title>
                        </div>
                    </div>

                    <motion.section
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '1.5rem',
                            padding: '1.5rem 2rem',
                        }}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {places.map((place) => (
                            <motion.div
                                key={place.id}
                                variants={itemVariants}
                                style={{
                                    width: 'calc(33.33% - 1rem)',
                                    textDecoration: 'none',
                                }}
                            >

                                <Link
                                    to={`/admin/approved-place/${place.slugifiedName}`}
                                    state={{ placeId: place.id }}
                                    style={{ textDecoration: 'none' }}
                                >

                                    <Card
                                        className={styles.card}
                                        hoverable
                                        cover={
                                            <img
                                                alt={place.name}
                                                src={place.imageUrl}
                                                style={{
                                                    height: '200px',
                                                    objectFit: 'cover',
                                                    borderTopLeftRadius: '8px',
                                                    borderTopRightRadius: '8px',
                                                }}
                                            />
                                        }
                                        style={{
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            transition: 'transform 0.3s ease',
                                            border: 'none'
                                        }}
                                        styles={{
                                            body: {
                                                backgroundColor: '#89ADFF',
                                                textAlign: 'center',
                                                padding: '1rem',
                                            }
                                        }}
                                    >
                                        <Card.Meta title={place.name} style={{ fontSize: '16px' }} />
                                    </Card>
                                </Link>

                            </motion.div>
                        ))}
                    </motion.section>

                    {pagesCount > 1 &&
                        <ConfigProvider theme={{
                            components: {
                                Pagination: {
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
                                className={styles.customPagination}
                            />
                        </ConfigProvider>
                    }

                </>
            }
        </>
    );

};

export default ApprovedPlaces;