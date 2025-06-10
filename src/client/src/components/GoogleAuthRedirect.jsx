import { useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { homePath } from "../constants/paths";
import { AuthContext } from "../contexts/AuthContext";

const GoogleAuthRedirect = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { userLogin } = useContext(AuthContext);

    const hasHandled = useRef(false);

    useEffect(() => {

        if (hasHandled.current) return;

        hasHandled.current = true;

        const params = new URLSearchParams(location.search);
        const accessToken = params.get("accessToken");
        const userId = params.get("userId");
        const userName = params.get("userName");
        const isAdmin = params.get("isAdmin") === "true";
        const profileImageUrl = params.get("profileImageUrl");

        if (accessToken && userId && userName) {
            userLogin({
                accessToken,
                userId,
                userName,
                isAdmin,
                profileImageUrl,
            });

            navigate(homePath, { replace: true, state: { username: userName } });

        } else {
            console.error("Google auth callback missing parameters");
            navigate("/sign-in", { replace: true });
        }
    }, [location.search, userLogin, navigate]);

    return null;
};


export default GoogleAuthRedirect;
