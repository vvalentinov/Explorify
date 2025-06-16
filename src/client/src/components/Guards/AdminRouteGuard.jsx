import { AuthContext } from '../../contexts/AuthContext';

import { useContext } from 'react';

import { Navigate, Outlet } from "react-router-dom";

import * as paths from '../../constants/paths';

const AdminRouteGuard = ({ children }) => {

    const { isAdmin } = useContext(AuthContext);

    if (!isAdmin) {
        return <Navigate to={paths.homePath} state={{ errorMessage: 'You must be an admin to access this page.' }} />
    }

    return children ? children : <Outlet />;
};

export default AdminRouteGuard;