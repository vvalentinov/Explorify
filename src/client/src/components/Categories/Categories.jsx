import styles from './Categories.module.css';

import Spinner from '../Spinner/Spinner';
import ImageOverlayContainer from '../ImageOverlayContainer/ImageOverlayContainer';

import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

import { categoriesServiceFactory } from "../../services/categoriesService";

import { Spin, ConfigProvider } from 'antd';

const Categories = () => {

    const categoriesService = categoriesServiceFactory();

    const [categories, setCategories] = useState([]);
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        const startTime = Date.now();

        categoriesService
            .getCategories()
            .then((res) => {
                setCategories(res);
                const elapsed = Date.now() - startTime;
                const remainingTime = Math.max(1000 - elapsed, 0);

                setTimeout(() => {
                    setShowSpinner(false);
                }, remainingTime);
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
            <section className={styles.categoriesSection}>
                {categories && categories.map(x => (
                    <Link
                        key={x.id}
                        to={`/categories/${x.slugifiedName}`}
                        className={styles.cardLink}
                        state={{ categoryId: x.id }}
                    >
                        <ImageOverlayContainer imageUrl={x.imageUrl} text={x.name} />
                    </Link>
                ))}
            </section>
    );
};

export default Categories;