import { Button, Grid, Space, theme, Typography } from "antd";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const Footer = () => {
    const { token } = useToken();
    const screens = useBreakpoint();

    const styles = {
        container: {
            alignItems: "center",
            display: "flex",
            flexDirection: screens.md ? "row" : "column",
            gap: token.marginLG,
            justifyContent: "space-between",
            margin: "0 auto",
            maxWidth: token.screenXL,
            padding: screens.md ? `0px ${token.paddingLG}px` : `0px ${token.padding}px`
        },
        footer: {
            backgroundColor: token.colorBgBase,
            borderTop: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
            padding: `${token.sizeXXL}px 0px`
        },
        nav: {
            alignItems: "center",
            marginLeft: screens.md ? `-${token.margin}px` : 0
        },
        text: {
            color: token.colorTextSecondary,
            textAlign: screens.md ? "right" : "center"
        }
    };

    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <Space
                    style={styles.nav}
                    direction={screens.md ? "horizontal" : "vertical"}
                    size={screens.md ? 0 : "small"}
                >
                    <Button type="text" href="#">
                        About
                    </Button>
                    <Button type="text" href="#">
                        Help
                    </Button>
                    <Button type="text" href="#">
                        Terms & Conditions
                    </Button>
                </Space>
                <Text style={styles.text}>
                    © {new Date().getFullYear()} Explorify. All Rights Reserved.
                </Text>
            </div>
        </footer>
    );
};

export default Footer;