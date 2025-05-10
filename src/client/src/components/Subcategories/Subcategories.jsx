import styles from './Subcategories.module.css';

import slugify from 'slugify';
import { useState, useEffect } from 'react';
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';

import { Card, Empty, Typography, Spin, ConfigProvider } from "antd";

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

        const startTime = Date.now();

        if (categoryId) {
            categoriesService
                .getSubcategories(categoryId)
                .then(res => {
                    setCategoryData(res);

                    const elapsed = Date.now() - startTime;
                    const remainingTime = Math.max(1000 - elapsed, 0);

                    setTimeout(() => {
                        setShowSpinner(false);
                    }, remainingTime);
                }).catch(err => {
                    console.log(err);
                    setShowSpinner(false);
                });
        } else {
            categoriesService
                .getSubcategoriesBySlugName(slugCategoryName)
                .then(res => {
                    setCategoryData(res);

                    const elapsed = Date.now() - startTime;
                    const remainingTime = Math.max(1000 - elapsed, 0);

                    setTimeout(() => {
                        setShowSpinner(false);
                    }, remainingTime);
                }).catch(err => {
                    console.log(err);
                    setShowSpinner(false);
                });
        }

    }, []);

    return (
        <>
            <section className={styles.subcategoriesSection}>
                {
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
                        categoryData.subcategories?.length > 0 ?
                            (
                                <>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '1rem 0'
                                    }}>
                                        <Card
                                            title={
                                                <Typography.Title level={4} style={{ margin: 0, color: '#2e7d32' }}>
                                                    {categoryData.categoryName}
                                                </Typography.Title>
                                            }
                                            variant='borderless'
                                            style={{
                                                width: '60%',
                                                background: 'linear-gradient(135deg, #e0f8e9, #ccf2e0)',
                                                boxShadow: '0 4px 20px rgba(0, 128, 0, 0.1)',
                                                borderRadius: '16px',
                                                padding: '0.5rem',
                                                border: 'solid 1px green'
                                            }}
                                            styles={{
                                                header: {
                                                    textAlign: 'center',
                                                    backgroundColor: '#b2e5b2',
                                                    borderRadius: '12px 12px 0 0',
                                                },
                                                body: {
                                                    textAlign: 'center',
                                                    fontSize: '15px',
                                                    color: '#2f4f4f',
                                                }
                                            }}
                                        >
                                            <Typography.Paragraph style={{ margin: 0 }}>
                                                {categoryData.categoryDescription}
                                            </Typography.Paragraph>
                                        </Card>
                                    </div>

                                    <div className={styles.subcategoriesContainer}>
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