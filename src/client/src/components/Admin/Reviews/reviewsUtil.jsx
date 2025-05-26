import styles from './styles.module.css';

import { EnvironmentOutlined, UserOutlined } from '@ant-design/icons';

import {
    Pagination,
    ConfigProvider,
    Spin,
    Card,
    Typography,
    Radio,
    Empty,
    Avatar,
    Rate,
    Button,
    App,
    Modal
} from 'antd';

import { motion } from 'framer-motion';

import { useState } from 'react';

export const renderSpinner = (spinnerLoading) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 63px)'
        }}
    >
        <ConfigProvider
            theme={{
                components: {
                    Spin: { colorPrimary: 'white' }
                }
            }}
        >
            <Spin size='large' spinning={spinnerLoading} />
        </ConfigProvider>
    </div>
);

export const renderEmptyState = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
    >
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '1rem' }}>
            <Card
                style={{
                    textAlign: 'center',
                    backgroundColor: '#f0fff4',
                    borderRadius: '16px',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #b7eb8f',
                    width: '60%'
                }}
            >
                <Empty
                    image={<EnvironmentOutlined style={{ fontSize: '50px', color: '#52c41a' }} />}
                    styles={{
                        image: {
                            marginBottom: '8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }
                    }}
                    description={
                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#389e0d' }}>
                            No reviews here yet!
                        </div>
                    }
                />
            </Card>
        </div>
    </motion.div>
);

export const renderFilterReviewsCard = (options, filter, handleSortChange) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
            }}
        >
            <Card
                style={{
                    width: '60%',
                    padding: '1rem 2rem',
                    backgroundColor: '#f3e9fe',
                    border: '1px solid #9c4dcc',
                    borderRadius: '16px',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    marginTop: '2rem'
                }}
            >
                <ConfigProvider
                    theme={{
                        components: {
                            Radio: {
                                colorPrimary: '#9c4dcc',
                                buttonBg: '#e6d4f5',
                                buttonColor: '#6a2c91',
                                buttonSolidCheckedBg: '#9c4dcc',
                                buttonSolidCheckedColor: 'white',
                                buttonSolidCheckedHoverBg: '#8a3dac',
                                buttonSolidCheckedActiveBg: '#9c4dcc',
                                borderRadius: 12,
                            },
                        },
                    }}
                >
                    <Typography.Paragraph italic={true}>
                        Filter Reviews
                    </Typography.Paragraph>

                    <Radio.Group
                        options={options}
                        defaultValue={filter}
                        optionType="button"
                        value={filter}
                        buttonStyle="solid"
                        size="large"
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            flexWrap: 'wrap',
                        }}
                        onChange={handleSortChange}
                        name='Sort'
                    />
                </ConfigProvider>
            </Card>
        </div>
    );
}

export const renderPagination = (pagesCount, currentPage, handlePageChange) =>
    pagesCount > 1 && (
        <ConfigProvider>
            <Pagination
                align="center"
                onChange={handlePageChange}
                current={currentPage}
                total={pagesCount * 6}
                pageSize={6}
                style={{ textAlign: 'center', marginBottom: '1rem' }}
                className={styles.customPagination}
            />
        </ConfigProvider>
    );