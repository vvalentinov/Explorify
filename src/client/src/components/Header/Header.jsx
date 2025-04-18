import styles from './Header.module.css';

import {
    Button,
    Menu,
    Space,
    theme,
    Grid,
    ConfigProvider,
} from "antd";

import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import * as paths from '../../constants/paths';
import { AuthContext } from '../../contexts/AuthContext';

const { useToken } = theme;
const { useBreakpoint } = Grid;

const menuItems = [
    {
        label: <NavLink to={paths.homePath}>Explorify</NavLink>,
        key: "explorify",
    },
    {
        label: <NavLink to={paths.categoriesPath}>Categories</NavLink>,
        key: "categories",
    }
];

const Header = () => {

    const { isAuthenticated, username } = useContext(AuthContext);

    const { token } = useToken();
    const screens = useBreakpoint();

    const dynamicStyles = {
        container: {
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            margin: "0 auto",
            maxWidth: token.screenXL,
            padding: screens.md ? `0px ${token.paddingLG}px` : `0px ${token.padding}px`,
        },
        header: {
            backgroundColor: token.colorBgContainer,
            borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
            position: "relative",
        },
        logo: {
            display: "block",
            height: token.sizeLG,
            left: "50%",
            position: screens.md ? "static" : "absolute",
            top: "50%",
            transform: screens.md ? " " : "translate(-50%, -50%)",
        },
        menu: {
            backgroundColor: "transparent",
            borderBottom: "none",
            lineHeight: screens.sm ? "4rem" : "3.5rem",
            marginLeft: screens.md ? "0px" : `-${token.size}px`,
            width: screens.md ? "inherit" : token.sizeXXL,
        },
        menuContainer: {
            alignItems: "center",
            display: "flex",
            gap: token.size,
            width: "100%",
        }
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        // colorPrimary: '#e91e63',
                        // borderRadius: ,
                        // fontSize: 20,
                        // colorText: 'coral',
                    },
                },
            }}
        >
            <nav style={dynamicStyles.header}>
                <div style={dynamicStyles.container}>
                    <div style={dynamicStyles.menuContainer}>
                        <Menu
                            style={dynamicStyles.menu}
                            mode="horizontal"
                            items={menuItems}
                        />
                    </div>
                    {/* {screens.md ? <Button type="text">Log in</Button> : ""} */}
                    <Space>
                        <NavLink to={paths.signInPath}>
                            <Button color='cyan' variant='text' size='large'>Sign In</Button>
                        </NavLink>
                        <NavLink to={paths.signUpPath}>
                            <Button color='cyan' variant='solid' size='large'>Sign Up</Button>
                        </NavLink>
                    </Space>
                </div>
            </nav>
        </ConfigProvider>
    );
};

export default Header;