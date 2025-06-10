import { Button, Grid, Space, Typography } from "antd";

const { useBreakpoint } = Grid;

const Footer = () => {
    const screens = useBreakpoint();
    const isMdUp = screens.md;

    return (
        <footer
            style={{
                // backgroundColor: "#f9f9f9",
                borderTop: "1.5px solid #e0e0e0",
                padding: "2.5rem 1rem",
                width: "100%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: isMdUp ? "row" : "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "0 auto",
                    gap: "1.5rem",
                    padding: isMdUp ? "0 2rem" : "0 1rem",
                }}
            >
                <Space
                    direction={isMdUp ? "horizontal" : "vertical"}
                    size={isMdUp ? "middle" : "small"}
                    style={{
                        display: "flex",
                        justifyContent: isMdUp ? "flex-start" : "center",
                        width: isMdUp ? "auto" : "100%",
                        textAlign: "center",
                        marginLeft: '4rem'
                    }}
                >
                    <Button
                        variant="solid"
                        size="large"
                        color="cyan"
                        style={{
                            border: "none",
                            fontSize: "1.5rem",
                            padding: "1.8rem 1.2rem",
                        }}
                    >
                        About
                    </Button>
                    <Button
                        variant="solid"
                        size="large"
                        color="cyan"
                        style={{
                            border: "none",
                            fontSize: "1.5rem",
                            padding: "1.8rem 1.2rem",
                        }}
                    >
                        Help
                    </Button>
                    <Button
                        variant="solid"
                        size="large"
                        color="cyan"
                        style={{
                            border: "none",
                            fontSize: "1.5rem",
                            padding: "1.8rem 1.2rem",
                        }}
                    >
                        Terms & Conditions
                    </Button>
                </Space>

                <Typography.Text
                    style={{
                        color: "#888",
                        fontSize: "1.3rem",
                        textAlign: isMdUp ? "right" : "center",
                        width: isMdUp ? "auto" : "100%",
                        marginRight: '4rem'
                    }}
                >
                    © {new Date().getFullYear()} Explorify. All Rights Reserved.
                </Typography.Text>
            </div>
        </footer>
    );
};

export default Footer;
