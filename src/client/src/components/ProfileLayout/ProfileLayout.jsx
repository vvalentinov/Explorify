import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";

import { Outlet } from "react-router-dom";
import { Layout, ConfigProvider } from "antd";

import { useState } from "react";

const ProfileLayout = () => {
    return (
        <ConfigProvider theme={{
            components: {
                Layout: {
                    siderBg: '#e6fffb',
                    margin: '0 !important'
                }
            }
        }}>
            <Layout>
                <Layout.Sider width={"30%"}>
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