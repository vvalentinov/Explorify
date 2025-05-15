import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App.jsx';

import enUS from 'antd/es/locale/en_US';
import { ConfigProvider, App as AntdApp } from 'antd';

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <BrowserRouter>
        <ConfigProvider
            locale={enUS}
            theme={{
                cssVar: true,
                components: {
                    Input: {
                        activeShadow: '#13c2c2',
                        colorPrimary: '#13c2c2',
                        hoverBorderColor: '#13c2c2'
                    },
                    // Pagination: {
                    //     itemActiveBg: '#e8fffb',
                    //     itemActiveColor: '#52c41a',
                    //     colorPrimary: '#52c41a',
                    //     colorPrimaryHover: '#389e0d',
                    // },
                    Select: {
                        activeBorderColor: '#13c2c2',
                        hoverBorderColor: '#13c2c2',
                    },
                    Cascader: {
                        controlItemBgHover: '#e6fffb',
                        controlHeight: 40,
                        controlOutlineWidth: 2,
                        controlOutline: '#13c2c2',
                        colorPrimary: '#13c2c2',
                        controlItemBgActive: '#e6fffb',
                    },
                }
            }}
        >
            <AntdApp>
                <App />
            </AntdApp>
        </ConfigProvider>
    </BrowserRouter>
    // </StrictMode>
)
