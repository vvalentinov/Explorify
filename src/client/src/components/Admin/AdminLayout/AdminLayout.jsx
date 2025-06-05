import styles from './AdminLayout.module.css';

import { Layout, Menu, FloatButton } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    CommentOutlined,
} from '@ant-design/icons';

import AdminDashboard from '../AdminDashboard';
import AdminUsers from '../Users';

import AdminPlaces from '../../Place/AdminPlaces';

import PlaceDetails from '../../Place/PlaceDetails/PlaceDetails';

import ScrollToTop from '../../ScrollToTop/ScrollToTop';

import ReviewsSection from '../../Review/ReviewsSection/ReviewsSection';

const { Header, Content, Footer } = Layout;

const AdminLayout = () => {

    const navigate = useNavigate();

    const leftMenuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined style={{ fontSize: '25px' }} />,
            label: 'Dashboard',
            onClick: () => navigate('/admin'),
        },
        {
            key: 'places',
            icon: <EnvironmentOutlined style={{ fontSize: '25px' }} />,
            label: 'Places',
            onClick: () => navigate('/admin/places'),
        },
        {
            key: 'reviews',
            icon: <CommentOutlined style={{ fontSize: '25px' }} />,
            label: 'Reviews',
            onClick: () => navigate('/admin/reviews'),
        },
        {
            key: 'users',
            icon: <UserOutlined style={{ fontSize: '25px' }} />,
            label: 'Users',
            onClick: () => navigate('/admin/users'),
        },
    ];

    const rightMenuItems = [
        {
            key: 'home',
            icon: <HomeOutlined style={{ fontSize: '25px' }} />,
            label: 'Main Site',
            onClick: () => navigate('/'),
        },
    ];

    return (
        <Layout>

            <ScrollToTop />

            <Header className={styles.adminHeader}>
                <div className={styles.adminNavContainer}>

                    <div className={styles.adminMenuLeft}>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            items={leftMenuItems}
                        />
                    </div>

                    <div className={styles.adminMenuRight}>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            items={rightMenuItems}
                            selectable={false}
                        />
                    </div>

                </div>
            </Header>


            <Content className={styles.adminContent}>

                <Routes>
                    <Route index element={<AdminDashboard />} />

                    <Route path="users" element={<AdminUsers />} />

                    <Route path='places' element={<AdminPlaces />} />
                    <Route path='place/:placeName' element={<PlaceDetails isForAdmin={true} />} />

                    <Route path='reviews' element={<ReviewsSection isForPlace={false} isForUser={false} isForAdmin={true} />} />
                </Routes>

                <FloatButton.BackTop className="custom-backtop" />

            </Content>

            <Footer
                style={{
                    backgroundColor: '#1f1e2f',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '3rem 2rem',
                    borderTop: '1px solid #2c2c3e',
                }}
            >
                <div style={{ fontSize: '20px' }}>
                    Admin Panel · Explorify ©{new Date().getFullYear()} · Built with ❤️ by the Explorify Team
                </div>
            </Footer>

        </Layout>
    );
};

export default AdminLayout;
