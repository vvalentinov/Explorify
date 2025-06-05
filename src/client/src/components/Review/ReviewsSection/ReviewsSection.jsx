import styles from './ReviewsSection.module.css';

import { useState, useContext, useEffect } from "react";

import { reviewsServiceFactory } from "../../../services/reviewsService";

import { AuthContext } from "../../../contexts/AuthContext";

import {
    renderEmptyState,
    renderSpinner,
    renderOrderReviewsCard
} from '../reviewsUtil';
import ReviewsList from "../ReviewsList";

const sortOptions = [
    { label: 'Newest', value: 'Newest' },
    { label: 'Oldest', value: 'Oldest' },
    { label: 'Most Helpful', value: 'MostHelpful' },
];

import WriteReviewCard from '../WriteReviewCard';
import UploadReviewModal from '../Modals/UploadReviewModal';
import FilterCard from '../../FilterCard/FilterCard';

import { Typography } from "antd";

import Pagination from '../../Pagination/Pagination';

const ReviewsSection = ({
    isForAdmin = false,
    isForPlace = true,
    isForUser = false,
    placeId = null,
    isOwner
}) => {

    const { token } = useContext(AuthContext);

    const reviewsService = reviewsServiceFactory(token);

    // State Management
    const [reviews, setReviews] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [filter, setFilter] = useState('Approved');
    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [sortOption, setSortOption] = useState("Newest");

    const [isUploadReviewModalOpen, setIsUploadReviewModalOpen] = useState(false);

    const handleWriteReviewClick = () => setIsUploadReviewModalOpen(true);

    const fetchReviews = async () => {

        setSpinnerLoading(true);

        let response;

        if (isForAdmin) {
            if (filter === 'Approved') {
                response = await reviewsService.getApproved(currentPage, true);
            } else if (filter === 'Unapproved') {
                response = await reviewsService.getUnapproved(currentPage, true);
            } else if (filter === 'Deleted') {
                response = await reviewsService.getDeleted(currentPage, true);
            }
        } else if (isForUser) {
            if (filter === 'Approved') {
                response = await reviewsService.getApproved(currentPage, false);
            } else if (filter === 'Unapproved') {
                response = await reviewsService.getUnapproved(currentPage, false);
            } else if (filter === 'Deleted') {
                response = await reviewsService.getDeleted(currentPage, false);
            }
        } else if (isForPlace && placeId) {
            response = await reviewsService.getPlaceReviews(placeId, currentPage, sortOption);
        }

        setPagesCount(response?.pagination?.pagesCount);
        setReviews(response?.reviews);
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

                {!isForAdmin && (
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <Typography.Title level={3} style={{ marginBottom: 0 }}>
                            {isForUser ? 'My Reviews' : 'Reviews'}
                        </Typography.Title>
                    </div>
                )}

                {/* Write Review */}
                {isForPlace && !isOwner &&
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WriteReviewCard handleOpenModal={handleWriteReviewClick} />
                    </div>
                }

                {/* Sort/Filter */}
                {isForPlace && pagesCount > 1 && renderOrderReviewsCard(sortOptions, sortOption, handleSortChange)}

                {!isForPlace && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: 'auto' }}>
                        <FilterCard defaultValue={filter} handleFilterChange={handleFilterChange} isForAdmin={isForAdmin} value={filter} />
                    </div>
                )}


                {/* Upload Review Modal */}
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
                {
                    !spinnerLoading && pagesCount > 1 &&
                    <Pagination
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                        isForAdmin={isForAdmin}
                        pagesCount={pagesCount}
                    />
                }
            </div>

        </>
    )

};

export default ReviewsSection;