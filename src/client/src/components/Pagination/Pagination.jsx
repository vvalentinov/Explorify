import { Pagination as AntPagination, ConfigProvider } from "antd";

import styles from './Pagination.module.css';

const Pagination = ({ handlePageChange, currentPage, pagesCount, isForAdmin }) => {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Pagination: {
                        itemActiveBg: isForAdmin ? '#e6f4ff' : '#e8fffb',
                        itemActiveColor: isForAdmin ? '#1677ff' : '#52c41a',
                        colorPrimary: isForAdmin ? '#1677ff' : '#52c41a',
                        colorPrimaryHover: isForAdmin ? '#1677ff' : '#52c41a',
                        colorBgTextHover: isForAdmin ? '#e6f4ff' : '#e8fffb',
                    },
                },
            }}
        >
            <div className={isForAdmin ? styles.adminPaginationWrapper : styles.paginationWrapper}>
                <AntPagination
                    align="center"
                    onChange={handlePageChange}
                    current={currentPage}
                    total={pagesCount * 6}
                    pageSize={6}
                    style={{ textAlign: 'center', margin: '2rem 0', fontSize: '2rem' }}
                />
            </div>
        </ConfigProvider>
    )
};

export default Pagination;