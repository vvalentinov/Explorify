import { Card, Empty } from "antd";
import { EnvironmentOutlined } from '@ant-design/icons';

import { motion } from 'framer-motion';

const NoPlacesFoundCard = ({ isForAdmin = false }) => {

    const styles = isForAdmin
        ? {
            backgroundColor: '#e6f4ff',
            borderColor: '#91d5ff',
            iconColor: '#1890ff',
            textColor: '#096dd9',
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
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    margin: '2rem 0',
                }}
            >
                <Card
                    style={{
                        textAlign: 'center',
                        backgroundColor: styles.backgroundColor,
                        borderRadius: '16px',
                        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.05)',
                        border: `1px solid ${styles.borderColor}`,
                        width: '60%',
                    }}
                >
                    <Empty
                        image={<EnvironmentOutlined style={{ fontSize: '50px', color: styles.iconColor }} />}
                        description={
                            <div style={{ fontSize: '18px', fontWeight: 600, color: styles.textColor }}>
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
            </div>
        </motion.div>
    );
};

export default NoPlacesFoundCard;