import './App.css';

import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';

import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

import { Routes, Route, useLocation } from 'react-router-dom';

import AdminLayout from './components/Admin/AdminLayout/AdminLayout';

import Alert from './components/Alert';

const App = () => {

    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <AuthProvider>
            <NotificationProvider>
                <Alert />
                {isAdminRoute ? (
                    <Routes>
                        <Route path="/admin/*" element={<AdminLayout />} />
                    </Routes>
                ) : (
                    <>
                        <Header />
                        <Main />
                        <Footer />
                    </>
                )}
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;