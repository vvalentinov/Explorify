
import { useState, useContext, useEffect } from "react";

import { reviewsServiceFactory } from "../../services/reviewsService";

import { AuthContext } from "../../contexts/AuthContext";

import {
    renderEmptyState,
    renderFilterReviewsCard, // only for admin and user
    renderPagination,
    renderSpinner,
    renderOrderReviewsCard // only for place reviews
} from './reviewsUtil';
import ReviewsList from "./ReviewsList";

const sortOptions = [
    { label: 'Newest', value: 'Newest' },
    { label: 'Oldest', value: 'Oldest' },
    { label: 'Most Helpful', value: 'MostHelpful' },
];

const filterOptions = [
    { label: 'Approved', value: 'approved' },
    { label: 'Unapproved', value: 'unapproved' },
    { label: 'Recently Deleted', value: 'recentlyDeleted' },
];

import WriteReviewCard from './WriteReviewCard';
import UploadReviewModal from './UploadReviewModal';

import { Card, Empty } from "antd";

const ReviewsSection = ({
    isForAdmin = false,
    isForPlace = true,
    isForUser = false,
    placeId = null
}) => {

    const { token } = useContext(AuthContext);

    const reviewsService = reviewsServiceFactory(token);

    // State Management
    const [reviews, setReviews] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [filter, setFilter] = useState('approved');
    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [sortOption, setSortOption] = useState("Newest");

    const [isUploadReviewModalOpen, setIsUploadReviewModalOpen] = useState(false);

    const handleWriteReviewClick = () => setIsUploadReviewModalOpen(true);

    const fetchReviews = async () => {

        setSpinnerLoading(true);

        let response;

        if (isForAdmin) {
            if (filter === 'approved') {
                response = await reviewsService.getApproved(currentPage, true);
            } else if (filter === 'unapproved') {
                response = await reviewsService.getUnapproved(currentPage, true);
            } else if (filter === 'recentlyDeleted') {
                response = await reviewsService.getDeleted(currentPage, true);
            }
        } else if (isForUser) {
            if (filter === 'approved') {
                response = await reviewsService.getApproved(currentPage, false);
            } else if (filter === 'unapproved') {
                response = await reviewsService.getUnapproved(currentPage, false);
            } else if (filter === 'recentlyDeleted') {
                response = await reviewsService.getDeleted(currentPage, false);
            }
        } else if (isForPlace && placeId) {
            response = await reviewsService.getPlaceReviews(placeId, currentPage, sortOption);
        }

        setPagesCount(response.pagination?.pagesCount);
        setReviews(response.reviews);
        setSpinnerLoading(false);

    };

    useEffect(() => {
        fetchReviews();
    }, [currentPage, filter, sortOption]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setCurrentPage(1);
    }

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <>
            <Card
                style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                    border: 'none',
                    margin: '2rem 3rem',
                    padding: 0,
                    backgroundColor: isForAdmin ? '#292840' : '#ffffff',
                }}
                title={isForUser ? 'My Reviews' : 'Reviews Section'}
                styles={{
                    header: {
                        background: isForAdmin
                            ? 'linear-gradient(90deg, #1677ff 0%, #69c0ff 100%)' // bluish gradient
                            : 'linear-gradient(90deg, #52c41a 0%, #36cfc9 100%)', // greenish gradient
                        color: isForAdmin ? '#003a8c' : 'inherit',
                    },
                }}
            >

                {/* Show Write Review Card */}
                {isForPlace && <WriteReviewCard handleOpenModal={handleWriteReviewClick} />}

                {/* Show Sort Options */}
                {isForPlace && pagesCount > 1 && renderOrderReviewsCard(sortOptions, sortOption, handleSortChange)}

                {/* Show Filter Options */}
                {!isForPlace && renderFilterReviewsCard(filterOptions, filter, handleFilterChange, isForAdmin)}

                {/* Show Write Review Modal */}
                {
                    isForPlace &&
                    placeId &&
                    <UploadReviewModal
                        isModalOpen={isUploadReviewModalOpen}
                        placeId={placeId}
                        reviewService={reviewsService}
                        setIsModalOpen={setIsUploadReviewModalOpen}
                    />
                }

                {/* Show Reviews List */}
                {
                    spinnerLoading ?
                        renderSpinner(spinnerLoading, isForAdmin) :
                        (reviews?.length > 0 ? (

                            <ReviewsList
                                reviews={reviews}
                                isForAdmin={isForAdmin}
                                isForPlace={isForPlace}
                                isForUser={isForUser}
                                setReviews={setReviews}
                            />

                        ) : renderEmptyState(isForAdmin))
                }

                {/* Show Pagination */}
                {!spinnerLoading && renderPagination(pagesCount, currentPage, handlePageChange, isForAdmin)}

            </Card>
        </>
    )

};

export default ReviewsSection;