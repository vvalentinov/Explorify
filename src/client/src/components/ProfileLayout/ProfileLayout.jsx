import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";

import { Outlet } from "react-router-dom";
import { Layout, ConfigProvider } from "antd";

const ProfileLayout = () => {
    return (
        <ConfigProvider theme={{
            components: {
                Layout: {
                    siderBg: '#e6fffb'
                }
            }
        }}>
            <Layout>
                <Layout.Sider width={"20%"}>
                    <ProfileSidebar />
                </Layout.Sider>
                <Layout.Content>
                    <Outlet />
                </Layout.Content>
            </Layout>
        </ConfigProvider>
    );
};

export default ProfileLayout;