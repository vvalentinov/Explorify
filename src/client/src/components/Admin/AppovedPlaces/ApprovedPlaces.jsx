import styles from './ApprovedPlaces.module.css';

import { useState, useEffect } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import { useContext } from 'react';

import { AuthContext } from '../../../contexts/AuthContext';

import { adminServiceFactory } from '../../../services/adminService';

import { Pagination, ConfigProvider, Spin, Card } from 'antd';

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
                    setPagesCount(res.pagination.pagesCount);
                    setPlaces(res.places);
                    setSpinnerLoading(false);
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
                                    // cursor: 'pointer',
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
                                        }}
                                        styles={{
                                            body: {
                                                backgroundColor: '#eafffb',
                                                textAlign: 'center',
                                                padding: '1rem',
                                            }
                                        }}
                                    >
                                        <Card.Meta title={place.name} style={{ fontSize: '16px' }} />

                                        {/* <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                        <button
                                            onClick={() =>
                                                navigate(`/place/${place.slugifiedName}`, { state: { placeId: place.id } })
                                            }
                                            style={{
                                                backgroundColor: '#52c41a',
                                                color: 'white',
                                                padding: '6px 16px',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                            }}
                                        >
                                            Go To Place
                                        </button>
                                        <button
                                            onClick={() => console.log('Unapprove logic here')}
                                            style={{
                                                backgroundColor: '#ff4d4f',
                                                color: 'white',
                                                padding: '6px 16px',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                            }}
                                        >
                                            Unapprove
                                        </button>
                                    </div> */}
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
                            />
                        </ConfigProvider>
                    }

                </>
            }
        </>
    );

};

export default ApprovedPlaces;