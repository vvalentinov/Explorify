import { useState, useEffect, useContext } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import { placesServiceFactory } from "../../../services/placesService";

import { fireError } from "../../../utils/fireError";

import { AuthContext } from '../../../contexts/AuthContext';

import OwnerPlaceButtonsSection from "./OwnerPlaceButtonsSection";
import PlaceDetailsSection from './PlaceDetailsSection/PlaceDetailsSection';

import PlaceStatusPill from './PlaceStatusPill';

import ApprovedPlaceCard from './Cards/ApprovedPlaceCard';
import UnapprovedPlaceCard from './Cards/UnapprovedPlaceCard';
import DeletedPlaceCard from "./Cards/DeletedPlaceCard";

import ReviewsSection from '../../Review/ReviewsSection/ReviewsSection';

const PlaceDetails = ({ isForAdmin = false }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const { placeName } = useParams();

    const { userId, token } = useContext(AuthContext);

    const placeService = placesServiceFactory(token);

    const [place, setPlace] = useState({});
    const [loading, setLoading] = useState(true);

    const isOwner = userId && place?.userId === userId;

    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {

        if (location.state?.placeId) {

            placeService
                .getPlaceDetailsById(location.state?.placeId, isForAdmin)
                .then(res => {

                    setPlace(res);
                    setLoading(false);

                }).catch(err => {
                    fireError(err);
                    navigate('/');
                });

            if (!isForAdmin) {
                placeService
                    .getPlaceWeatherData(location.state?.placeId)
                    .then(res => setWeatherData(res.weatherData))
                    .catch(err => fireError(err));
            }

        } else {

            placeService
                .getPlaceDetailsBySlugifiedName(placeName)
                .then(res => {

                    setPlace(res);
                    setLoading(false);

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
                    {isForAdmin && <PlaceStatusPill place={place} />}

                    {/* Place Details Section */}
                    <PlaceDetailsSection
                        setPlace={setPlace}
                        isForAdmin={isForAdmin}
                        loading={loading}
                        place={place}
                        weatherData={weatherData}
                    />

                    {/* Owner Buttons Section */}
                    {
                        isOwner && !isForAdmin && <OwnerPlaceButtonsSection place={place} placeService={placeService} />
                    }

                    {/* Reviews Section */}
                    {place.isApproved && !isForAdmin && (
                        <ReviewsSection
                            isForAdmin={false}
                            isForPlace={true}
                            isForUser={false}
                            placeId={place?.id}
                            isOwner={isOwner}
                        />
                    )}

                    {isForAdmin && (
                        place?.isDeleted ? (
                            <DeletedPlaceCard />
                        ) : place?.isApproved ? (
                            <ApprovedPlaceCard place={place} />
                        ) : (
                            <UnapprovedPlaceCard place={place} />
                        )
                    )}

                </>
            )}
        </>
    )
};

export default PlaceDetails;