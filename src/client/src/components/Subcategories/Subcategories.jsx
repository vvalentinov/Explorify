import styles from './Subcategories.module.css';

import slugify from 'slugify';
import { useState, useEffect } from 'react';
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';

import { Card, Empty, Flex, Spin, Typography } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

import { categoriesServiceFactory } from '../../services/categoriesService';

const { Meta } = Card;

const { Title, Paragraph } = Typography;

const Subcategories = () => {

    const location = useLocation();
    const { categoryName } = useParams();
    const navigate = useNavigate();

    const [categoryData, setCategoryData] = useState({});
    const [showSpinner, setShowSpinner] = useState(true);

    const categoriesService = categoriesServiceFactory();

    const { categoryId } = location.state || {};

    useEffect(() => {

        const normalized = slugify(categoryName, { lower: true });

        if (categoryName !== normalized) {
            navigate(`/categories/${normalized}`, { replace: true });
        }

        if (categoryId) {
            categoriesService
                .getSubcategories(categoryId)
                .then(res => {
                    setCategoryData(res);
                    setShowSpinner(false);
                });
        } else {
            categoriesService
                .getSubcategoriesByName(categoryName)
                .then(res => {
                    setCategoryData(res);
                    setShowSpinner(false);
                });
        }

    }, []);

    return (
        <>
            <section>
                {
                    showSpinner ?
                        <div className={styles.spinnerContainer}>
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 70, color: '#13c2c2' }} spin />} />
                        </div> :
                        categoryData.subcategories.length > 0 ?
                            (
                                <>
                                    <Title level={2} style={{ textAlign: 'center' }}>{categoryData.categoryName}</Title>
                                    {/* <Paragraph style={{
                                        textAlign: 'center',
                                        fontSize: '20px',
                                        border: 'solid 2px black'
                                    }}>
                                        {categoryData.categoryDescription}
                                    </Paragraph> */}
                                    <Card style={{ margin: '1rem 3rem', border: 'solid 1px black' }}>

                                        <Paragraph style={{ textAlign: 'center', fontSize: '15px', margin: '0' }}>{categoryData.categoryDescription}</Paragraph>
                                    </Card>
                                    <div className={styles.subcategoriesSection}>
                                        {categoryData.subcategories.map(x =>
                                            <Link
                                                key={x.id}
                                                to={`/account/sign-in`}
                                                className={styles.cardLink}
                                                state={{ categoryId: x.id }}
                                            >
                                                <Card
                                                    hoverable
                                                    className={styles.zoomCard}
                                                    // style={{ backgroundColor: '#fcfcd4' }}
                                                    cover={<img style={{ height: 200 }} alt={x.name} src={x.imageUrl} />}
                                                >
                                                    <Meta style={{ textAlign: 'center' }} title={x.name} />
                                                </Card>
                                            </Link>)
                                        }
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