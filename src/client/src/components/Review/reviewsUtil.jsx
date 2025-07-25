import { CommentOutlined } from '@ant-design/icons';

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
            height: 'calc(100vh - 140px)'
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

export const renderEmptyState = (isForAdmin) => {
    const styles = isForAdmin
        ? {
            backgroundColor: '#2b2b3d',
            borderColor: '#000',
            iconColor: '#cfcfe6',
            textColor: '#c9d1d9',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
        }
        : {
            backgroundColor: '#f0fff4',
            borderColor: '#b7eb8f',
            iconColor: '#52c41a',
            textColor: '#389e0d',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.05)',
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
                    marginTop: '1rem',
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
                            <CommentOutlined
                                style={{
                                    fontSize: '70px',
                                    color: styles.iconColor,
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
                                    fontSize: '2rem',
                                    fontWeight: 600,
                                    color: styles.textColor,
                                }}
                            >
                                No reviews found!
                            </div>
                        }
                    />
                </Card>
            </div>
        </motion.div>
    );
};


export const renderOrderReviewsCard = (options, sortOption, handleSortChange) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card
                style={{
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
                    <div className="radio-large">
                        <Radio.Group
                            options={options}
                            defaultValue={sortOption}
                            optionType="button"
                            value={sortOption}
                            buttonStyle="solid"
                            size="large"
                            style={{
                                // width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '1rem',
                                flexWrap: 'wrap',
                                fontSize: '10px'
                            }}
                            onChange={handleSortChange}
                            name="Sort"
                        />
                    </div>

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