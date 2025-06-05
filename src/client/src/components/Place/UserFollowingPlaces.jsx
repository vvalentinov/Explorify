import PlacesWithSearchPage from "./PlacesWithSearchPage/PlacesWithSearchPage";

import { useLocation } from "react-router-dom";

import { Avatar, Typography, Space, Card } from "antd";

const { Title } = Typography;

const UserFollowingPlaces = () => {

    const location = useLocation();
    const { userState } = location.state || {};

    const userFollowingId = userState.id;
    const userName = userState.userName;

    console.log(userName);

    return (
        <>
            <PlacesWithSearchPage
                isForAdmin={false}
                searchContext="UserFollowing"
                userFollowingId={userFollowingId}
                userFollowingUserName={userName}
            />
        </>
    )
};

export default UserFollowingPlaces;