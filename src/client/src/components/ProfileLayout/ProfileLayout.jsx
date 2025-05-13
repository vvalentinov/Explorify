import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";

import { Outlet } from "react-router-dom";
import { Layout, ConfigProvider } from "antd";

const ProfileLayout = () => {
    return (
        <ConfigProvider theme={{
            components: {
                Layout: {
                    margin: '0 !important'
                }
            }
        }}>
            <Layout>
                <ProfileSidebar />
                <Layout.Content>
                    <Outlet />
                </Layout.Content>
            </Layout>
        </ConfigProvider>
    );
};

export default ProfileLayout;