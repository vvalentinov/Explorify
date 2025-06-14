import { Pagination as AntPagination, ConfigProvider } from "antd";

import "./Pagination.module.css";

const Pagination = ({
    handlePageChange,
    currentPage,
    pagesCount,
    isForAdmin
}) => {

    const adminTheme = {
        itemActiveBg: '#4a4a68',
        itemActiveColor: '#ffffff',
        itemBg: '#2b2b3d',
        itemLinkBg: '#2b2b3d',
        itemInputBg: '#1e1e2f',
        colorBgTextHover: '#3a3a52',
        colorText: '#ffffff',
        colorPrimary: '#4a4a68',
        colorPrimaryHover: '#4a4a68',
        controlOutline: 'none',
        controlOutlineWidth: 0,
        fontSize: 25,
        itemSize: 50,
    };

    const publicTheme = {
        itemActiveBg: 'lightgreen',
        itemActiveColor: 'black',
        colorPrimary: 'black',
        colorPrimaryHover: 'black',
        colorText: 'black',
        fontSize: 25,
        itemSize: 50,
    };

    return (
        <div className={isForAdmin ? "adminWrapper" : ""}>
            <ConfigProvider
                theme={{
                    components: {
                        Pagination: isForAdmin ? adminTheme : publicTheme,
                    },
                }}
            >
                <AntPagination
                    align="center"
                    showSizeChanger={false}
                    style={{ marginTop: '2rem' }}
                    defaultCurrent={1}
                    total={pagesCount * 6}
                    onChange={handlePageChange}
                    current={currentPage}
                    pageSize={6}
                />
            </ConfigProvider>
        </div>
    );
};

export default Pagination;
