import styles from './Categories.module.css';

import Spinner from '../Spinner/Spinner';
import ImageOverlayContainer from '../ImageOverlayContainer/ImageOverlayContainer';

import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

import { categoriesServiceFactory } from "../../services/categoriesService";

import slugify from 'slugify';

const Categories = () => {

    const categoriesService = categoriesServiceFactory();

    const [categories, setCategories] = useState([]);
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        categoriesService
            .getCategories()
            .then((res) => {
                setCategories(res);
                setShowSpinner(false);
            });
    }, []);

    return (
        showSpinner ?
            <Spinner />
            :
            <section className={styles.categoriesSection}>
                {categories && categories.map(x => (
                    <Link
                        key={x.id}
                        to={`/categories/${slugify(x.name, { lower: true })}`}
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