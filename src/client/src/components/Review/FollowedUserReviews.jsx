import ReviewsSection from "./ReviewsSection/ReviewsSection";

import { useLocation } from "react-router-dom";

const FollowedUserReviews = () => {

    const location = useLocation();

    const followedUser = location.state?.followedUser;

    return (
        <ReviewsSection
            isForAdmin={false}
            isForPlace={false}
            isForUser={false}
            isForFollowedUser={true}
            followedUser={followedUser}
        />
    );
};

export default FollowedUserReviews;