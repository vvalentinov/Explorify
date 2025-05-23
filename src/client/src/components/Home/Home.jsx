import styles from './Home.module.css';

import { motion } from 'framer-motion';

const AnimatedEmoji = () => (
    <motion.span
        style={{ display: 'inline-block', cursor: 'pointer' }}
        whileHover={{
            scale: 1.2,
            rotate: 10,
            transition: { type: 'spring', stiffness: 200, damping: 12 }
        }}
        whileTap={{
            scale: [1, 0.8, 1],  // pulse effect: normal -> smaller -> normal
            rotate: 0,
            transition: { duration: 0.3, ease: 'easeInOut' }
        }}
        aria-label="Globe emoji"
        role="img"
    >
        🌍
    </motion.span>
);

const Home = () => {

    return (
        <section className={styles.heroSection}>

            <div className={styles.heroBackground} />

            <motion.div
                className={styles.heroContent}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
                <h1 className={styles.heroTitle}>
                    Discover Cool Places <AnimatedEmoji />
                </h1>
                <p className={styles.heroDescription}>
                    Ready to embark on unforgettable adventures? Explorify helps you discover breathtaking places, share your own experiences, and connect with fellow travelers around the world. Whether you're chasing hidden waterfalls, wandering through ancient cities, or savoring local flavors off the beaten path, Explorify is your trusted companion.
                </p>
            </motion.div>

        </section >

    );
};

export default Home;