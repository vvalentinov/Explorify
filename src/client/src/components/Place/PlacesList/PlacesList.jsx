import { Pagination, Spin, ConfigProvider } from "antd";

import PlaceCard from "./PlaceCard";

import { motion } from 'framer-motion';

import DeletedPlaceCard from "./DeletedPlaceCard";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

import NoPlacesFoundCard from "./NoPlacesFoundCard";

const PlacesList = ({
    places,
    isForAdmin,
    spinnerLoading,
    pagesCount,
    currentPage,
    handlePageChange,
}) => {

    return (
        <>
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
                                    colorPrimary: isForAdmin ? 'white' : 'green'
                                }
                            }
                        }}>
                            <Spin size='large' spinning={spinnerLoading} />
                        </ConfigProvider>
                    </div> :
                    <>
                        {places?.length > 0 ?

                            <motion.section
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    gap: '1.5rem',
                                    padding: '2rem',
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
                                            cursor: place.isDeleted ? 'default' : 'pointer',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {place.isDeleted ?
                                            <DeletedPlaceCard isForAdmin={isForAdmin} place={place} /> :
                                            <PlaceCard isForAdmin={isForAdmin} place={place} />
                                        }
                                    </motion.div>
                                ))}
                            </motion.section> :

                            // No Places Found Card
                            <NoPlacesFoundCard isForAdmin={isForAdmin} />
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
                                <Pagination
                                    align="center"
                                    onChange={handlePageChange}
                                    current={currentPage}
                                    total={pagesCount * 6}
                                    pageSize={6}
                                    style={{ textAlign: 'center', marginBottom: '1rem' }}
                                />
                            </ConfigProvider>
                        )}

                    </>
            }
        </>
    );
};

export default PlacesList;
