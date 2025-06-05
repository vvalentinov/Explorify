import { Typography } from 'antd';

import {
    CheckOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';

import { motion } from 'framer-motion';

const getStatusConfig = (place) => {
    if (place?.isDeleted) {
        return {
            text: 'Deleted Place',
            icon: <DeleteOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />,
            gradient: 'linear-gradient(135deg, #ffdde1, #ff4d4f)',
        };
    } else if (place?.isApproved) {
        return {
            text: 'Approved Place',
            icon: <CheckOutlined style={{ color: '#52c41a', marginRight: 8 }} />,
            gradient: 'linear-gradient(135deg, #d2f8d2, #52c41a)',
        };
    } else {
        return {
            text: 'Unapproved Place',
            icon: <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />,
            gradient: 'linear-gradient(135deg, #fff1b8, #faad14)',
        };
    }
};

const PlaceStatusPill = ({ place }) => {

    const { text, icon, gradient } = getStatusConfig(place);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '2rem',
            }}
        >
            <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                    background: gradient,
                    borderRadius: '999px',
                    padding: '0.75rem 2rem',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'default',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography.Title
                    level={4}
                    style={{
                        margin: 0,
                        color: '#1f1e2f',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '2rem'
                    }}
                >
                    {icon}
                    {text}
                </Typography.Title>
            </motion.div>
        </div>
    );
};

export default PlaceStatusPill;
