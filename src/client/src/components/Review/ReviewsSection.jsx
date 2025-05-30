import styles from './ReviewsSection.module.css';

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

import { Card, Empty, Typography } from "antd";

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
            <div className={styles.reviewsSectionContainer}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <Typography.Title level={3} style={{ marginBottom: 0 }}>
                        {isForUser ? 'My Reviews' : 'Reviews'}
                    </Typography.Title>
                </div>

                {/* Write Review */}
                {isForPlace && <WriteReviewCard handleOpenModal={handleWriteReviewClick} />}

                {/* Sort/Filter */}
                {isForPlace && pagesCount > 1 && renderOrderReviewsCard(sortOptions, sortOption, handleSortChange)}
                {!isForPlace && renderFilterReviewsCard(filterOptions, filter, handleFilterChange, isForAdmin)}

                {/* Modal */}
                {isForPlace && placeId && (
                    <UploadReviewModal
                        isModalOpen={isUploadReviewModalOpen}
                        placeId={placeId}
                        reviewService={reviewsService}
                        setIsModalOpen={setIsUploadReviewModalOpen}
                    />
                )}

                {/* Reviews List */}
                {spinnerLoading
                    ? renderSpinner(spinnerLoading, isForAdmin)
                    : (reviews?.length > 0
                        ? (
                            <ReviewsList
                                reviews={reviews}
                                isForAdmin={isForAdmin}
                                isForPlace={isForPlace}
                                isForUser={isForUser}
                                setReviews={setReviews}
                            />
                        ) : renderEmptyState(isForAdmin))}

                {/* Pagination */}
                {!spinnerLoading && renderPagination(pagesCount, currentPage, handlePageChange, isForAdmin)}
            </div>

        </>
    )

};

export default ReviewsSection;