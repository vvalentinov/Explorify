import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";

import { Outlet } from "react-router-dom";
import { Layout } from "antd";

const { Sider, Content } = Layout;

const ProfileLayout = () => {
    return (
        <Layout>
            <Sider width={"20%"}>
                <ProfileSidebar />
            </Sider>
            <Content>
                <Outlet />
            </Content>
        </Layout>
    );
};

export default ProfileLayout;