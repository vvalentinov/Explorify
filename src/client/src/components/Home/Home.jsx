import styles from './Home.module.css';

import { motion } from 'framer-motion';
import { Card } from 'antd';

const Home = () => {

    return (
        <section className={styles.heroSection}>

            <div className={styles.heroBackground} />

            <motion.div
                className={styles.heroContent}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
                <Card
                    style={{
                        borderRadius: 16,
                        backgroundColor: '#fff',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
                    }}
                >
                    <Card.Meta
                        title={
                            <h1
                                style={{
                                    fontWeight: 700,
                                    fontSize: '2.8rem',
                                    marginBottom: '1rem',
                                    fontFamily: 'Poppins, sans-serif',
                                }}
                            >
                                Discover Hidden Gems 🌍
                            </h1>
                        }
                        description={
                            <p
                                style={{
                                    fontSize: '1.15rem',
                                    lineHeight: 1.6,
                                    color: '#555',
                                    textAlign: 'justify'
                                }}
                            >
                                Ready to embark on unforgettable adventures? Explorify helps you
                                discover breathtaking places, share your own experiences, and
                                connect with fellow travelers around the world. From secret
                                trails to vibrant cities, your next journey starts here!
                            </p>
                        }
                    />
                </Card>
            </motion.div>
        </section >

    );
};

export default Home;