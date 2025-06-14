import { Spin, ConfigProvider } from "antd";

import PlaceCard from "./PlaceCard";
import DeletedPlaceCard from "./DeletedPlaceCard";

import { motion } from 'framer-motion';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.05,

        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

import NoPlacesFoundCard from "./NoPlacesFoundCard";
import Pagination from "../../Pagination/Pagination";

import styles from './PlacesList.module.css';

const PlacesList = ({
    places,
    isForAdmin,
    spinnerLoading,
    pagesCount,
    currentPage,
    handlePageChange,
    isForFavPlaces,
    forceFetchPlaces
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
                                className={styles.placesSection}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >

                                <div className={styles.placesContainer}>
                                    {places.map((place) => (
                                        <motion.div
                                            key={place.id}
                                            className={styles.cardWrapper}
                                            variants={itemVariants}
                                            style={{
                                                cursor: place.isDeleted ? 'default !important' : 'pointer !important'
                                            }}
                                        >
                                            {
                                                place.isDeleted ?
                                                    (
                                                        <DeletedPlaceCard isForAdmin={isForAdmin} place={place} />
                                                    ) :
                                                    (
                                                        <PlaceCard
                                                            isForFavPlaces={isForFavPlaces}
                                                            isForAdmin={isForAdmin}
                                                            place={place}
                                                            forceFetchPlaces={forceFetchPlaces}
                                                        />
                                                    )
                                            }
                                        </motion.div>
                                    ))}
                                </div>

                                {pagesCount > 1 && !spinnerLoading && (

                                    <Pagination
                                        currentPage={currentPage}
                                        handlePageChange={handlePageChange}
                                        pagesCount={pagesCount}
                                        isForAdmin={isForAdmin}
                                    />

                                )}

                            </motion.section>
                            :
                            <NoPlacesFoundCard isForAdmin={isForAdmin} />
                        }
                    </>
            }
        </>
    );
};

export default PlacesList;
