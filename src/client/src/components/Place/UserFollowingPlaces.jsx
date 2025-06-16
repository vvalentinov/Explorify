import PlacesWithSearchPage from "./PlacesWithSearchPage/PlacesWithSearchPage";

import { useLocation } from "react-router-dom";

const UserFollowingPlaces = () => {

    const location = useLocation();

    const { userState } = location.state || {};

    const userFollowingId = userState.id;
    const userName = userState.userName;
    const imageUrl = userState.profileImageUrl;

    return (
        <>
            <PlacesWithSearchPage
                isForAdmin={false}
                searchContext="UserFollowing"
                userFollowingId={userFollowingId}
                userFollowingUserName={userName}
                userFollowingProfilePic={imageUrl}
            />
        </>
    )
};

export default UserFollowingPlaces;