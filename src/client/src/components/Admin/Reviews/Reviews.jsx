import styles from './Reviews.module.css';

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useContext } from 'react';

import { AuthContext } from '../../../contexts/AuthContext';

import { reviewsServiceFactory } from '../../../services/reviewsService';
import { adminServiceFactory } from '../../../services/adminService.js';

import { fireError } from '../../../utils/fireError';

import ReviewsList from './ReviewsList.jsx';

import {
    renderSpinner,
    renderEmptyState,
    renderFilterReviewsCard,
    renderPagination
} from './reviewsUtil.jsx';

const options = [
    { label: 'Approved', value: 'approved' },
    { label: 'Unapproved', value: 'unapproved' },
    { label: 'Recently Deleted', value: 'recentlyDeleted' },
];

const Reviews = () => {

    const { token } = useContext(AuthContext);

    const reviewsService = reviewsServiceFactory(token);
    const adminService = adminServiceFactory(token);

    // State Management
    const [reviews, setReviews] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [filter, setFilter] = useState('approved');
    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchreviews = async () => {

        setSpinnerLoading(true);

        try {

            let response;

            if (filter === 'approved') {
                response = await reviewsService.getApproved(currentPage, true);
            } else if (filter === 'unapproved') {
                response = await reviewsService.getUnapproved(currentPage, true);
            } else if (filter === 'recentlyDeleted') {
                response = await reviewsService.getDeleted(currentPage, true);
            }

            setPagesCount(response.pagination.pagesCount);
            setReviews(response.reviews);
            setSpinnerLoading(false);

        } catch (err) {
            fireError(err);
            setSpinnerLoading(false);
        }
    };

    useEffect(() => {
        fetchreviews();
    }, [filter, currentPage]);

    useEffect(() => {

        if (reviews.length > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    }, [reviews]);

    const handlePageChange = (page) => setCurrentPage(page);

    const handleSortChange = (e) => {
        setCurrentPage(1);
        setFilter(e.target.value);
    };

    return (
        <>
            {renderFilterReviewsCard(options, filter, handleSortChange)}

            {
                spinnerLoading ? renderSpinner(spinnerLoading)
                    : reviews?.length > 0 ? <ReviewsList adminService={adminService} reviews={reviews} />
                        : renderEmptyState()
            }

            {renderPagination(pagesCount, currentPage, handlePageChange)}
        </>
    );

};

export default Reviews;