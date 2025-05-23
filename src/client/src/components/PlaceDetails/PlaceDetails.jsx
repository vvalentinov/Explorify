import { App, Typography } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { useState, useEffect, useContext } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import { placesServiceFactory } from "../../services/placesService";
import { reviewsServiceFactory } from '../../services/reviewsService';

import { fireError } from "../../utils/fireError";

import { AuthContext } from '../../contexts/AuthContext';

import ReviewModal from './ReviewModal';
import UploadReviewModal from './UploadReviewModal';
import ReviewsSection from './ReviewsSection/ReviewsSection';
import PlaceDetailsSection from './PlaceDetailsSection/PlaceDetailsSection';

const PlaceDetails = () => {

    const { placeName } = useParams();

    const { modal } = App.useApp();

    const navigate = useNavigate();

    const { userId, token } = useContext(AuthContext);

    const placeService = placesServiceFactory(token);
    const reviewsService = reviewsServiceFactory(token);

    const location = useLocation();

    const [place, setPlace] = useState({});
    const [reviews, setReviews] = useState([]);
    const [pagesCount, setPagesCount] = useState(0);
    const [mapUrl, setMapUrl] = useState('');
    const [loading, setLoading] = useState(true);

    const isOwner = userId && place?.userId === userId;

    const confirm = () => {
        modal.confirm({
            title: 'Delete Place',
            icon: <ExclamationCircleOutlined />,
            content: (
                <p>
                    Are you sure you want to delete this place? <br />
                    <Typography.Text type="danger" strong>
                        This action will soft-delete the place. You will have 5 minutes to revert the deletion before it is permanently removed.
                    </Typography.Text>
                </p>
            ),
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => handlePlaceDelete()
        });
    };

    const handlePlaceDelete = () => {
        console.log(place.id);

        placeService
            .deletePlace(place?.id)
            .then(res => {
                navigate('/', { state: { successOperation: { message: res.successMessage } } })
            }).catch(err => {
                fireError(err);
            })
    }

    useEffect(() => {

        if (location.state?.placeId) {

            placeService
                .getPlaceDetailsById(location.state?.placeId)
                .then(res => {

                    setPlace(res);

                    setLoading(false);

                    if (res?.coordinates?.latitude && res?.coordinates?.longitude) {
                        const lat = res.coordinates.latitude;
                        const lon = res.coordinates.longitude;

                        const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

                        setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${lat},${lon}`);
                    }
                }).catch(err => {
                    fireError(err);
                    navigate('/');
                });

            reviewsService
                .getReviews(location.state?.placeId, 1, "Newest")
                .then(res => {
                    setReviews(res.reviews);
                    setPagesCount(res.pagesCount);
                }).catch(err => fireError(err));

        } else {

            placeService
                .getPlaceDetailsBySlugifiedName(placeName)
                .then(res => {

                    setPlace(res);
                    setLoading(false);

                    if (res?.coordinates?.latitude && res?.coordinates?.longitude) {
                        const lat = res.coordinates.latitude;
                        const lon = res.coordinates.longitude;

                        const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

                        setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${lat},${lon}`);
                    }
                }).catch(err => {
                    fireError(err);
                    navigate('/');
                });
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
                    <PlaceDetailsSection loading={loading} place={place} mapUrl={mapUrl} />

                    {isOwner && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '2rem',
                            margin: '2rem 3rem',
                            flexWrap: 'wrap',
                        }}>
                            <div style={{
                                flex: 1,
                                minWidth: 250,
                                backgroundColor: '#f6ffed',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                textAlign: 'center',
                            }}>
                                <h3 style={{ color: '#13c2c2', marginBottom: '1rem' }}>Want to make changes?</h3>
                                <button
                                    onClick={() => navigate(`/place/${place.slugifiedName}/edit`, { state: { placeId: place.id } })}
                                    style={{
                                        backgroundColor: '#13c2c2',
                                        border: 'none',
                                        color: 'white',
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        transition: 'background 0.3s ease'
                                    }}
                                >
                                    Edit This Place
                                </button>
                            </div>

                            <div style={{
                                flex: 1,
                                minWidth: 250,
                                backgroundColor: '#fff1f0',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                textAlign: 'center',
                            }}>
                                <h3 style={{ color: '#cf1322', marginBottom: '1rem' }}>No longer relevant?</h3>
                                <button
                                    onClick={() => confirm()}
                                    style={{
                                        backgroundColor: '#cf1322',
                                        border: 'none',
                                        color: 'white',
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        transition: 'background 0.3s ease'
                                    }}
                                >
                                    Delete This Place
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Reviews Section */}
                    {place.isApproved && (
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
                    )}

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