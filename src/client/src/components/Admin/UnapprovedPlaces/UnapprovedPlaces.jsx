import styles from './UnapprovedPlaces.module.css';

import {
    useState,
    useEffect,
    useContext,
} from "react";

import {
    Card,
    Spin,
    App,
    Pagination,
    ConfigProvider,
    Typography
} from 'antd';

import { Link } from 'react-router-dom';

import { AuthContext } from "../../../contexts/AuthContext";
import { adminServiceFactory } from "../../../services/adminService";

import { fireError } from '../../../utils/fireError';

import { useNavigate } from 'react-router-dom';

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

const UnapprovedPlaces = () => {

    const { notification } = App.useApp();

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const adminService = adminServiceFactory(token);

    // State Management
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [pagesCount, setPagesCount] = useState(0);
    // const [currentPage, setCurrentPage] = useState(1);

    const [pagination, setPagination] = useState({});

    useEffect(() => {

        const startTime = Date.now();

        adminService
            .getUnapprovedPlaces(1)
            .then(res => {

                // setPlaces(res.places);
                // setPagesCount(res.pagination.pagesCount);

                const elapsed = Date.now() - startTime;
                const remainingTime = Math.max(1000 - elapsed, 0);

                setTimeout(() => {
                    setPlaces(res.places);
                    setPagination(res.pagination);
                    setLoading(false);
                }, remainingTime);

            })
            .catch(err => {
                fireError(err);
                setLoading(false);
            });
    }, []);

    const handlePageChange = (page) => {

        setLoading(true);
        setCurrentPage(page);

        const MIN_SPINNER_TIME = 1000;
        const startTime = Date.now();

        adminService
            .getUnapprovedPlaces(page)
            .then(res => {

                const elapsed = Date.now() - startTime;
                const remaining = MIN_SPINNER_TIME - elapsed;

                setTimeout(() => {
                    setPlaces(res.places);
                    setPagesCount(res.pagination.pagesCount);
                    setLoading(false);
                }, remaining > 0 ? remaining : 0);
            })
            .catch(err => {
                setLoading(false);
                fireError(err);
            });
    };

    return (
        <>
            {loading ?
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
                        <Spin size='large' spinning={loading} />
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
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                }}
                            // whileHover={{ scale: 1.03 }}
                            >
                                <Link
                                    to={`/admin/unapproved-place/${place.slugifiedName}`}
                                    state={{ placeId: place.id }}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Card className={styles.card}
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
                                            color: '#ffffff', // ✅ Text color here
                                            border: 'none'
                                        }}
                                        styles={{
                                            body: {
                                                backgroundColor: '#89ADFF',
                                                textAlign: 'center',
                                                padding: '1rem',
                                                color: '#ffffff',
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

                        <Pagination
                            align='center'
                            onChange={handlePageChange}
                            current={currentPage}
                            total={pagesCount * 6}
                            pageSize={6}
                            style={{ textAlign: 'center', marginBottom: '1rem' }}
                            className={styles.customPagination}
                        />

                    }

                </>
            }
        </>
    );
};

export default UnapprovedPlaces;