import styles from './Subcategories.module.css';

import slugify from 'slugify';
import { useState, useEffect } from 'react';
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';

import { Empty, Spin, ConfigProvider } from "antd";

import { categoriesServiceFactory } from '../../services/categoriesService';
import ImageOverlayContainer from '../ImageOverlayContainer/ImageOverlayContainer';
import { fireError } from '../../utils/fireError';

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

const Subcategories = () => {
    const location = useLocation();
    const { categoryName } = useParams();
    const navigate = useNavigate();

    const [categoryData, setCategoryData] = useState({});
    const [showSpinner, setShowSpinner] = useState(true);

    const categoriesService = categoriesServiceFactory();
    const { categoryId } = location.state || {};

    const fetchData = async () => {
        try {
            let res;
            if (categoryId) {
                res = await categoriesService.getSubcategories(categoryId);
            } else {
                res = await categoriesService.getSubcategoriesBySlugName(slugCategoryName);
            }

            setCategoryData(res);
        } catch (err) {
            fireError(err);
        } finally {
            setShowSpinner(false);
        }
    };


    useEffect(() => {
        const slugCategoryName = slugify(categoryName, { lower: true });

        if (categoryName !== slugCategoryName) {
            navigate(`/categories/${slugCategoryName}`, { replace: true });
        }

        fetchData();
    }, []);


    return (
        <section className={styles.subcategoriesSection}>
            {showSpinner ? (
                <ConfigProvider
                    theme={{
                        components: {
                            Spin: { colorPrimary: 'green' }
                        }
                    }}
                >
                    <div className={styles.spinnerContainer}>
                        <Spin size='large' spinning={showSpinner} />
                    </div>
                </ConfigProvider>
            ) : categoryData.subcategories?.length > 0 ? (
                <>
                    <div className={styles.categoryCard}>
                        <h2 className={styles.categoryTitle}>{categoryData.categoryName}</h2>
                        <p className={styles.categoryDescription}>{categoryData.categoryDescription}</p>
                    </div>

                    <motion.div
                        className={styles.subcategoriesContainer}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {categoryData.subcategories.map(x => (
                            <motion.div className={styles.cardLink} key={x.id} variants={itemVariants}>
                                <Link
                                    to={`/categories/${categoryName}/${x.slugifiedName}`}

                                    state={{ subcategoryId: x.id, subcategoryName: x.name }}
                                >
                                    <ImageOverlayContainer imageUrl={x.imageUrl} text={x.name} />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </>
            ) : (
                <div className={styles.spinnerContainer}>
                    <Empty style={{ fontSize: '50px', fontFamily: 'cursive' }} />
                </div>
            )}
        </section>
    );
};

export default Subcategories;
