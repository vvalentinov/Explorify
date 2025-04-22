import styles from './Categories.module.css';

import { Card } from "antd";

const { Meta } = Card;

import { categoriesServiceFactory } from "../../services/categoriesService";

import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import slugify from 'slugify';

const Categories = () => {

    const categoriesService = categoriesServiceFactory();

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        categoriesService
            .getCategories()
            .then((res) => setCategories(res));
    }, []);

    return (
        <section className={styles.categoriesSection}>
            {categories && categories.map(x =>
                <Link
                    key={x.id}
                    to={`/categories/${slugify(x.name, { lower: true })}`}
                    className={styles.cardLink}
                    state={{ categoryId: x.id }}
                >
                    <Card
                        hoverable
                        // style={{ width: 240 }}
                        className={styles.zoomCard}
                        cover={<img style={{ height: 200 }} alt={x.name} src={x.imageUrl} />}
                    >
                        <Meta title={<div style={{ textAlign: 'center' }}>{x.name}</div>} />
                    </Card>
                </Link>
            )}
        </section>
    );
};

export default Categories;