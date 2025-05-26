import { useState, useEffect, useContext } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import { placesServiceFactory } from "../../../services/placesService";
import { reviewsServiceFactory } from '../../../services/reviewsService';

import { fireError } from "../../../utils/fireError";

import { AuthContext } from '../../../contexts/AuthContext';

import ReviewsSection from './ReviewsSection/ReviewsSection';
import OwnerPlaceButtonsSection from "./OwnerPlaceButtonsSection";
import PlaceDetailsSection from './PlaceDetailsSection/PlaceDetailsSection';

import { getGoogleMapsUrl } from '../../../utils/getGoogleMapsUrl';

const PlaceDetails = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { placeName } = useParams();

    const { userId, token } = useContext(AuthContext);

    const placeService = placesServiceFactory(token);
    const reviewsService = reviewsServiceFactory(token);

    const [place, setPlace] = useState({});
    const [mapUrl, setMapUrl] = useState('');
    const [loading, setLoading] = useState(true);

    const isOwner = userId && place?.userId === userId;

    useEffect(() => {

        if (location.state?.placeId) {

            placeService
                .getPlaceDetailsById(location.state?.placeId, false)
                .then(res => {

                    setPlace(res);
                    setLoading(false);

                    if (res?.latitude && res?.longitude) {
                        setMapUrl(getGoogleMapsUrl(res.latitude, res.longitude));
                    }

                }).catch(err => {
                    fireError(err);
                    navigate('/');
                });

        } else {

            placeService
                .getPlaceDetailsBySlugifiedName(placeName)
                .then(res => {

                    setPlace(res);
                    setLoading(false);

                    if (res?.latitude && res?.longitude) {
                        setMapUrl(getGoogleMapsUrl(res.latitude, res.longitude));
                    }

                }).catch(err => {
                    fireError(err);
                    navigate('/');
                });
        }

    }, []);


    return (
        <>
            {place && (
                <>
                    {/* Place Details Section */}
                    <PlaceDetailsSection loading={loading} place={place} mapUrl={mapUrl} />

                    {/* Owner Buttons Section */}
                    {
                        isOwner && <OwnerPlaceButtonsSection place={place} placeService={placeService} />
                    }

                    {/* Reviews Section */}
                    {place.isApproved && (
                        <ReviewsSection
                            place={place}
                            reviewsService={reviewsService}
                            userId={userId}
                        />
                    )}

                </>
            )}
        </>
    )
};

export default PlaceDetails;