// import './App.css';

// import Header from './components/Header/Header';
// import Main from './components/Main/Main';
// import Footer from './components/Footer/Footer';

// import { AuthProvider } from './contexts/AuthContext';
// import { NotificationProvider } from './contexts/NotificationContext';

// import { Routes, Route, useLocation } from 'react-router-dom';

// import AdminLayout from './components/Admin/AdminLayout/AdminLayout';
// import Alert from './components/Alert';

// import AdminRouteGuard from './components/Guards/AdminRouteGuard';

// const App = () => {

//     const location = useLocation();
//     const isAdminRoute = location.pathname.startsWith('/admin');

//     return (
//         <AuthProvider>

//             <NotificationProvider>

//                 <Alert />

//                 {
//                     isAdminRoute ?
//                         (
//                             <Route element={<AdminRouteGuard />}>
//                                 <Routes>
//                                     <Route path="/admin/*" element={<AdminLayout />} />
//                                 </Routes>
//                             </Route>
//                         ) :
//                         (
//                             <>
//                                 <Header />
//                                 <Main />
//                                 <Footer />
//                             </>
//                         )
//                 }

//             </NotificationProvider>

//         </AuthProvider>
//     );
// }

// export default App;


import './App.css';

import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';

import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

import { Routes, Route, useLocation } from 'react-router-dom';

import AdminLayout from './components/Admin/AdminLayout/AdminLayout';
import Alert from './components/Alert';

import AdminRouteGuard from './components/Guards/AdminRouteGuard';

const App = () => {
    const location = useLocation();

    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <AuthProvider>
            <NotificationProvider>
                <Alert />

                {/* Only show header/footer on non-admin routes */}
                {!isAdminRoute && <Header />}

                <Routes>
                    {/* Public Routes */}
                    <Route path="/*" element={<Main />} />

                    {/* Admin Routes wrapped in Guard */}
                    <Route element={<AdminRouteGuard />}>
                        <Route path="/admin/*" element={<AdminLayout />} />
                    </Route>
                </Routes>

                {!isAdminRoute && <Footer />}
            </NotificationProvider>
        </AuthProvider>
    );
};

export default App;
