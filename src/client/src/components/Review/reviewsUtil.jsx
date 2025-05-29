import styles from './styles.module.css';

import { EnvironmentOutlined } from '@ant-design/icons';

import {
    Pagination,
    ConfigProvider,
    Spin,
    Card,
    Typography,
    Radio,
    Empty
} from 'antd';

import { motion } from 'framer-motion';

export const renderSpinner = (spinnerLoading, isForAdmin) => (
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
                    Spin: { colorPrimary: isForAdmin ? 'white' : 'green' }
                }
            }}
        >
            <Spin size='large' spinning={spinnerLoading} />
        </ConfigProvider>
    </div>
);

export const renderEmptyState = (isForAdmin) => (
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
                marginTop: '1rem',
            }}
        >
            <Card
                style={{
                    textAlign: 'center',
                    backgroundColor: isForAdmin ? '#e6f7ff' : '#f0fff4',
                    borderRadius: '16px',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.05)',
                    border: `1px solid ${isForAdmin ? '#91d5ff' : '#b7eb8f'}`,
                    width: '60%',
                }}
            >
                <Empty
                    image={
                        <EnvironmentOutlined
                            style={{
                                fontSize: '50px',
                                color: isForAdmin ? '#1890ff' : '#52c41a',
                            }}
                        />
                    }
                    styles={{
                        image: {
                            marginBottom: '8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    }}
                    description={
                        <div
                            style={{
                                fontSize: '18px',
                                fontWeight: 600,
                                color: isForAdmin ? '#096dd9' : '#389e0d',
                            }}
                        >
                            No reviews here yet!
                        </div>
                    }
                />
            </Card>
        </div>
    </motion.div>
);


export const renderFilterReviewsCard = (options, filter, handleFilterChange, isForAdmin) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
            }}
        >
            <Card
                style={{
                    width: '60%',
                    padding: '1rem 2rem',
                    backgroundImage: isForAdmin
                        ? 'linear-gradient(135deg, #d0e7ff 0%, #b4d0f8 100%)'
                        : 'none',
                    backgroundColor: isForAdmin ? undefined : '#f3e9fe',

                    // border: `1px solid ${isForAdmin ? 'blue' : '#9c4dcc'} `,
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                }}
            >
                <ConfigProvider
                    theme={{
                        components: {
                            Radio: isForAdmin
                                ? {
                                    colorPrimary: '#69a6f9',
                                    buttonBg: '#dceeff',
                                    buttonColor: '#0b3d91',
                                    buttonSolidCheckedBg: '#69a6f9',
                                    buttonSolidCheckedColor: 'white',
                                    buttonSolidCheckedHoverBg: '#4d8de8',
                                    buttonSolidCheckedActiveBg: '#4d8de8',
                                    borderRadius: 12,
                                }
                                : {
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
                        onChange={handleFilterChange}
                        name='Sort'
                    />
                </ConfigProvider>
            </Card>
        </div>
    );
}

export const renderOrderReviewsCard = (options, sortOption, handleSortChange) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Card
                style={{
                    width: '60%',
                    padding: '1rem 2rem',
                    backgroundColor: '#f3e9fe',
                    border: '1px solid #9c4dcc',
                    borderRadius: '16px',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center'
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
                        Order Reviews
                    </Typography.Paragraph>

                    <Radio.Group
                        options={options}
                        defaultValue={sortOption}
                        optionType="button"
                        value={sortOption}
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
    )
}

export const renderPagination = (pagesCount, currentPage, handlePageChange, isForAdmin) => {
    if (pagesCount <= 1) return null;

    const themeColors = isForAdmin
        ? {
            itemActiveBg: '#e6f4ff',
            itemActiveColor: '#1890ff',
            colorPrimary: '#1890ff',
            colorPrimaryHover: '#1677ff',
        }
        : {
            itemActiveBg: '#e8fffb',
            itemActiveColor: '#52c41a',
            colorPrimary: '#52c41a',
            colorPrimaryHover: '#389e0d',
        };



    return (
        <ConfigProvider
            theme={{
                components: {
                    Pagination: themeColors,
                },
            }}
        >
            <Pagination
                onChange={handlePageChange}
                current={currentPage}
                total={pagesCount * 6}
                pageSize={6}
                style={{ textAlign: 'center', marginBottom: '1rem', marginTop: '1.5rem' }}
                align='center'
            />
        </ConfigProvider>
    );
};