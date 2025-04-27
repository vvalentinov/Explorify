import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App.jsx';

import { ConfigProvider, App as AntdApp } from 'antd';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <ConfigProvider theme={{ cssVar: true }}>
                <AntdApp>
                    <App />
                </AntdApp>
            </ConfigProvider>
        </BrowserRouter>
    </StrictMode>
)
