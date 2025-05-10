import './App.css';

import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';

import { AuthProvider } from './contexts/AuthContext';

import { Routes, Route, useLocation } from 'react-router-dom';

import AdminLayout from './components/Admin/AdminLayout';
const App = () => {

    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <>
            {isAdminRoute ? (
                <Routes>
                    <Route path="/admin/*" element={<AdminLayout />} />
                </Routes>
            ) : (
                <AuthProvider>
                    <Header />
                    <Main />
                    <Footer />
                </AuthProvider>
            )}
        </>
    );
}

export default App;