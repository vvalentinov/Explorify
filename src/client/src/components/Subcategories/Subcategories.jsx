import styles from './Subcategories.module.css';

import slugify from 'slugify';
import { useState, useEffect } from 'react';
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';

import { Card, Empty, Typography } from "antd";

import Spinner from '../Spinner/Spinner';

import { categoriesServiceFactory } from '../../services/categoriesService';

import ImageOverlayContainer from '../ImageOverlayContainer/ImageOverlayContainer';

const Subcategories = () => {

    const location = useLocation();
    const { categoryName } = useParams();
    const navigate = useNavigate();

    const [categoryData, setCategoryData] = useState({});
    const [showSpinner, setShowSpinner] = useState(true);

    const categoriesService = categoriesServiceFactory();

    const { categoryId } = location.state || {};

    useEffect(() => {

        const slugCategoryName = slugify(categoryName, { lower: true });

        if (categoryName !== slugCategoryName) {
            navigate(`/categories/${slugCategoryName}`, { replace: true });
        }

        if (categoryId) {
            categoriesService
                .getSubcategories(categoryId)
                .then(res => {
                    setCategoryData(res);
                    setShowSpinner(false);
                }).catch(err => {
                    console.log(err);
                    setShowSpinner(false);
                });
        } else {
            categoriesService
                .getSubcategoriesBySlugName(slugCategoryName)
                .then(res => {
                    setCategoryData(res);
                    setShowSpinner(false);
                }).catch(err => {
                    console.log(err);
                    setShowSpinner(false);
                });
        }

    }, []);

    return (
        <>
            <section>
                {
                    showSpinner ?
                        <Spinner /> :
                        categoryData.subcategories?.length > 0 ?
                            (
                                <>
                                    <Typography.Title
                                        level={2}
                                        style={{ textAlign: 'center' }}>
                                        {categoryData.categoryName}
                                    </Typography.Title>

                                    <Card style={{ margin: '1rem 3rem' }}>
                                        <Typography.Paragraph style={{ textAlign: 'center', fontSize: '15px', margin: '0' }}>
                                            {categoryData.categoryDescription}
                                        </Typography.Paragraph>
                                    </Card>

                                    <div className={styles.subcategoriesSection}>
                                        {categoryData.subcategories.map(x =>
                                            <Link
                                                key={x.id}
                                                to={`/categories/${categoryName}/${x.slugifiedName}`}
                                                className={styles.cardLink}
                                                state={{ subcategoryId: x.id }}
                                            >
                                                <ImageOverlayContainer imageUrl={x.imageUrl} text={x.name} />
                                            </Link>
                                        )}
                                    </div>

                                </>
                            )
                            :
                            <div className={styles.spinnerContainer}>
                                <Empty style={{ fontSize: '50px', fontFamily: 'cursive' }} />
                            </div>
                }
            </section>
        </>
    );
};

export default Subcategories;