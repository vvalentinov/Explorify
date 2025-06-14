import { Card, Empty } from "antd";
import { EnvironmentOutlined } from '@ant-design/icons';

import { motion } from 'framer-motion';

const NoPlacesFoundCard = ({ isForAdmin = false }) => {

    const styles = isForAdmin
        ? {
            backgroundColor: '#2b2b3d',
            borderColor: '#000', // black border
            iconColor: '#cfcfe6',
            textColor: '#c9d1d9',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
        }
        : {
            backgroundColor: '#f0fff4',
            borderColor: '#b7eb8f',
            iconColor: '#52c41a',
            textColor: '#389e0d',
        };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
                display: 'flex',
                justifyContent: 'center',
            }}
        >

            <Card
                style={{
                    textAlign: 'center',
                    backgroundColor: styles.backgroundColor,
                    borderRadius: '16px',
                    boxShadow: styles.boxShadow,
                    border: `1px solid ${styles.borderColor}`,
                    width: '50%',
                }}
            >
                <Empty
                    image={
                        <EnvironmentOutlined
                            style={{
                                fontSize: '80px',
                                color: isForAdmin ? '#cfcfe6' : styles.iconColor, // override only for admin
                            }}
                        />
                    }
                    description={
                        <div style={{ fontSize: '2rem', fontWeight: 600, color: styles.textColor }}>
                            No places found!
                        </div>
                    }
                    styles={{
                        image: {
                            marginBottom: '8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    }}
                />
            </Card>

        </motion.div>
    );
};

export default NoPlacesFoundCard;