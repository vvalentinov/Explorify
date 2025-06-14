import { Pagination as AntPagination, ConfigProvider } from "antd";

import styles from './Pagination.module.css';

const Pagination = ({ handlePageChange, currentPage, pagesCount, isForAdmin }) => {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Pagination: {
                        itemActiveBg: isForAdmin ? '#91d5ff' : 'lightgreen',
                        itemActiveColor: 'black',
                        colorPrimary: 'black',
                        colorPrimaryHover: 'black',
                        colorText: 'black',
                    },
                },
            }}
        >
            {/* <div className={isForAdmin ? styles.adminPaginationWrapper : styles.paginationWrapper}>

               
                <AntPagination
                    align="center"
                    onChange={handlePageChange}
                    current={currentPage}
                    total={pagesCount * 6}
                    pageSize={6}
                    style={{ textAlign: 'center', margin: '2rem 0', fontSize: '2rem' }}
                />
            </div> */}

            <AntPagination
                align="center"
                showSizeChanger={false}
                style={{ marginTop: '2rem' }} defaultCurrent={1} total={pagesCount * 6}
                onChange={handlePageChange}
                current={currentPage}
                pageSize={6}
            />
        </ConfigProvider>
    )
};

export default Pagination;