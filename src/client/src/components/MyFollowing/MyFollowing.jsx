import { motion } from "framer-motion";
import { UsergroupAddOutlined } from '@ant-design/icons';
import { Card, Avatar, Button, Pagination, ConfigProvider } from 'antd';
import { useState, useEffect, useContext } from 'react';

import { AuthContext } from "../../contexts/AuthContext";

import { usersServiceFactory } from "../../services/usersService";

import { fireError } from "../../utils/fireError";

import slugify from "slugify";

import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

const MyFollowing = () => {

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const usersService = usersServiceFactory(token);

    const [users, setUsers] = useState([]);
    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {

        usersService
            .getFollowing(currentPage)
            .then(res => {
                setUsers(res.users);
                setPagesCount(res.pagination.pagesCount);
            }).catch(err => {
                fireError(err);
            });

    }, []);

    return (
        <>
            <div style={{ textAlign: 'center', margin: '1.5rem 0', }}>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{
                        scale: 1.05,
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                        background: 'linear-gradient(135deg, #b7eb8f, #87e8de)',
                        color: '#004d40',
                        borderRadius: '16px',
                        padding: '0.75rem 2rem',
                        display: 'inline-block',
                        fontWeight: '600',
                        fontSize: '1.4rem',
                        letterSpacing: '0.5px',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                        marginTop: '2rem'
                    }}
                >
                    <UsergroupAddOutlined />  My Following
                </motion.div>

            </div>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    padding: '1rem 2rem',
                }}
            >
                {users.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{
                            textAlign: 'center',
                            padding: '2rem',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #e6fffb, #f6ffed)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif"
                        }}
                    >
                        <UsergroupAddOutlined style={{ fontSize: '3rem', color: '#52c41a', marginBottom: '1rem' }} />
                        <h2 style={{ fontSize: '1.6rem', color: '#333', marginBottom: '0.5rem' }}>
                            You're not following anyone yet
                        </h2>
                        <p style={{ fontSize: '1rem', color: '#555' }}>
                            Start exploring places and follow users whose journeys inspire you!
                        </p>
                    </motion.div>
                ) :
                    users.map(user => (
                        <Card
                            key={user.id}
                            style={{
                                borderRadius: '16px',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                textAlign: 'center',
                                flexBasis: '30%'
                            }}
                        >

                            <Link to={`/profile/${slugify(user.userName, { lower: true })}`} state={{ userId: user.id }}>
                                <motion.div
                                    whileHover={{
                                        scale: 1.12,
                                        rotate: 9,
                                    }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                                    style={{
                                        display: 'inline-block',
                                        borderRadius: '50%',
                                        padding: '0.25rem',
                                    }}
                                >
                                    <Avatar
                                        size={150}
                                        src={user.profileImageUrl}
                                        style={{ marginBottom: '0.8rem' }}
                                    />
                                </motion.div>
                            </Link>


                            <h3
                                style={{
                                    marginBottom: '0.6rem',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '1.25rem',
                                    fontWeight: 600,
                                    color: '#333'
                                }}
                            >
                                {user.userName}
                            </h3>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                                <Button
                                    type="primary"
                                    shape="round"
                                    size="large"
                                    style={{
                                        backgroundColor: '#1890ff',
                                        borderColor: '#1890ff',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        padding: '0 1.5rem'
                                    }}
                                    onClick={() => navigate(`/${slugify(user.userName, { lower: true })}/places`, { state: { userState: user } })}
                                >
                                    Places
                                </Button>
                                <Button
                                    type="default"
                                    shape="round"
                                    size="large"
                                    style={{
                                        backgroundColor: '#36cfc9',
                                        borderColor: '#36cfc9',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        padding: '0 1.5rem'
                                    }}
                                >
                                    Reviews
                                </Button>
                            </div>


                        </Card>
                    ))
                }

                {pagesCount > 1 && (
                    <ConfigProvider
                        theme={{
                            components: {
                                Pagination: {
                                    itemActiveBg: isForAdmin ? '#e6f4ff' : '#e8fffb',
                                    itemActiveColor: isForAdmin ? '#1677ff' : '#52c41a',
                                    colorPrimary: isForAdmin ? '#1677ff' : '#52c41a',
                                    colorPrimaryHover: isForAdmin ? '#1677ff' : '#52c41a',
                                    colorBgTextHover: isForAdmin ? '#e6f4ff' : '#e8fffb',
                                    colorText: isForAdmin ? '#1677ff' : '#52c41a',
                                },
                            },
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
                            <Pagination
                                align="center"
                                onChange={handlePageChange}
                                current={currentPage}
                                total={pagesCount * 6}
                                pageSize={6}
                                style={{ textAlign: 'center', marginBottom: '1rem' }}
                            />
                        </div>
                    </ConfigProvider>
                )}
            </div>
        </>
    )
};

export default MyFollowing;