import { useNavigate, Navigate } from "react-router-dom";

import { useEffect, useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";

import { homePath } from '../../constants/paths';

const Logout = () => {
    const navigate = useNavigate();

    const { userLogout } = useContext(AuthContext);

    useEffect(() => {
        userLogout();
        localStorage.clear();
        navigate(homePath);
    }, []);

    return <Navigate to={homePath} />;
};

export default Logout;