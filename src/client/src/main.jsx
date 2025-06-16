import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import 'leaflet/dist/leaflet.css';
import App from './App.jsx';

import enUS from 'antd/es/locale/en_US';
import { ConfigProvider, App as AntdApp } from 'antd';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ConfigProvider
            locale={enUS}
            theme={{
                cssVar: true,
                components: {
                    Input: {
                        activeShadow: '#13c2c2',
                        colorPrimary: '#13c2c2',
                        hoverBorderColor: '#13c2c2',
                        controlHeight: 50,
                        fontSize: 25,
                        borderRadius: 12,
                    },
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
                    Pagination: {
                        itemSize: 50,
                        fontSize: 18,
                        itemActiveBg: '#13c2c2',
                        itemActiveColor: '#fff',
                        colorText: 'black',
                    },
                },
                token: {
                    borderRadius: 12,
                },
            }}
        >
            <AntdApp>
                <App />
            </AntdApp>
        </ConfigProvider>
    </BrowserRouter>
)
