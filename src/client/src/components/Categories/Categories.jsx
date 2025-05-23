import styles from './Categories.module.css';

import ImageOverlayContainer from '../ImageOverlayContainer/ImageOverlayContainer';

import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

import { categoriesServiceFactory } from "../../services/categoriesService";

import { Spin, ConfigProvider } from 'antd';

import { motion } from 'framer-motion';

import { fireError } from '../../utils/fireError';

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

const Categories = () => {

    const categoriesService = categoriesServiceFactory();

    const [categories, setCategories] = useState([]);
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {

        setShowSpinner(true);

        // const startTime = Date.now();

        categoriesService
            .getCategories()
            .then((res) => {

                setCategories(res);
                setShowSpinner(false);

                // const elapsed = Date.now() - startTime;
                // const remainingTime = Math.max(1000 - elapsed, 0);

                // setTimeout(() => {
                //     setCategories(res);
                //     setShowSpinner(false);
                // }, remainingTime);

            }).catch(err => {
                fireError(err);
                setShowSpinner(false);
            });

    }, []);

    return (
        showSpinner ?
            <ConfigProvider theme={{
                components: {
                    Spin: {
                        colorPrimary: 'green'
                    }
                }
            }}>
                <div className={styles.spinnerContainer}>
                    <Spin size='large' spinning={showSpinner} />
                </div>
            </ConfigProvider>
            :
            <motion.section
                className={styles.categoriesSection}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {categories && categories.map(x => (
                    <motion.div
                        key={x.id}
                        className={styles.cardMotionWrapper}
                        variants={itemVariants}
                    >
                        <Link
                            to={`/categories/${x.slugifiedName}`}
                            className={styles.cardLink}
                            state={{ categoryId: x.id }}
                        >
                            <ImageOverlayContainer imageUrl={x.imageUrl} text={x.name} />
                        </Link>
                    </motion.div>
                ))}
            </motion.section>
    );
};

export default Categories;