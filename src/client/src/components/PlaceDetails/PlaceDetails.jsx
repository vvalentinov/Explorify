import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import { placesServiceFactory } from "../../services/placesService";
import { reviewsServiceFactory } from '../../services/reviewsService';

import { fireError } from "../../utils/fireError";

import { AuthContext } from '../../contexts/AuthContext';

import ReviewModal from './ReviewModal';
import UploadReviewModal from './UploadReviewModal';
import ReviewsSection from './ReviewsSection/ReviewsSection';
import PlaceDetailsSection from './PlaceDetailsSection/PlaceDetailsSection';

const PlaceDetails = () => {

    const { userId, token } = useContext(AuthContext);

    const placeService = placesServiceFactory();
    const reviewsService = reviewsServiceFactory(token);

    const location = useLocation();

    const [place, setPlace] = useState({});
    const [reviews, setReviews] = useState([]);

    const [pagesCount, setPagesCount] = useState(0);

    useEffect(() => {

        if (location.state?.placeId) {
            placeService
                .getPlaceDetailsById(location.state?.placeId)
                .then(res => setPlace(res))
                .catch(err => fireError(err));

            reviewsService
                .getReviews(location.state?.placeId, 1, "Newest")
                .then(res => {
                    setReviews(res.reviews);
                    setPagesCount(res.pagesCount);
                }).catch(err => fireError(err));
        }

    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    return (
        <>
            {place && (
                <>

                    {/* Place Details Section */}
                    <PlaceDetailsSection place={place} />

                    {/* Reviews Section */}
                    <ReviewsSection
                        pagesCount={pagesCount}
                        reviews={reviews}
                        reviewsService={reviewsService}
                        setIsModalOpen={setIsModalOpen}
                        setIsReviewModalOpen={setIsReviewModalOpen}
                        setPagesCount={setPagesCount}
                        setReviews={setReviews}
                        setSelectedReview={setSelectedReview}
                        place={place}
                        userId={userId}
                    />

                    {/* Upload review form and modal */}
                    <UploadReviewModal
                        token={token}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        placeId={place.id}
                    />

                    {/* Review Display Modal */}
                    <ReviewModal
                        isReviewModalOpen={isReviewModalOpen}
                        selectedReview={selectedReview}
                        setIsReviewModalOpen={setIsReviewModalOpen}
                        reviewsService={reviewsService}
                        setSelectedReview={setSelectedReview}
                        setReviews={setReviews}
                    />

                </>
            )}
        </>
    )
};

export default PlaceDetails;