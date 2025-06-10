import styles from './ReviewsSection.module.css';

import { useContext, useEffect, useReducer } from "react";

import { reviewsServiceFactory } from "../../../services/reviewsService";

import { AuthContext } from "../../../contexts/AuthContext";

import {
    renderEmptyState,
    renderSpinner
} from '../reviewsUtil';
import ReviewsList from "../ReviewsList";

const sortOptions = [
    { label: 'Newest', value: 'Newest' },
    { label: 'Oldest', value: 'Oldest' },
    { label: 'Most Helpful', value: 'MostHelpful' },
];

const stateOptions = [
    { label: 'Approved', value: 'Approved' },
    { label: 'Unapproved', value: 'Unapproved' },
    { label: 'Recently Deleted', value: 'Deleted' },
];

import WriteReviewCard from '../WriteReviewCard';
import UploadReviewModal from '../Modals/UploadReviewModal';

import { Typography, Radio, ConfigProvider, Checkbox } from "antd";

import Pagination from '../../Pagination/Pagination';

import { StarFilled } from '@ant-design/icons';

import { entityState } from '../../../constants/entityState';
import { fireError } from '../../../utils/fireError';

import { initialState, reviewsReducer } from './reviewsSectionUtil';

const ReviewsSection = ({
    isForAdmin = false,
    isForPlace = true,
    isForUser = false,
    placeId = null,
    isOwner
}) => {

    const { token } = useContext(AuthContext);

    const reviewsService = reviewsServiceFactory(token);

    const [state, dispatch] = useReducer(reviewsReducer, initialState);

    const fetchReviews = async () => {

        dispatch({ type: 'SET_LOADING' });

        try {
            let response;
            const { filter, currentPage, sortOption, starFilters } = state;

            const isApproved = filter === entityState.Approved;
            const isUnapproved = filter === entityState.Unapproved;
            const isDeleted = filter === entityState.Deleted;

            if (isForAdmin || isForUser) {
                const isAdmin = isForAdmin;

                if (isApproved) {
                    response = await reviewsService.getApproved(currentPage, isAdmin, sortOption, starFilters);
                } else if (isUnapproved) {
                    response = await reviewsService.getUnapproved(currentPage, isAdmin, sortOption, starFilters);
                } else if (isDeleted) {
                    response = await reviewsService.getDeleted(currentPage, isAdmin, sortOption, starFilters);
                }
            } else if (isForPlace && placeId) {
                response = await reviewsService.getPlaceReviews(placeId, currentPage, sortOption, starFilters);
            }

            dispatch({
                type: 'SET_REVIEWS',
                payload: {
                    reviews: response?.reviews ?? [],
                    reviewsCount: response?.pagination?.recordsCount ?? 0,
                    pagesCount: response?.pagination?.pagesCount ?? 0,
                }
            });
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
            fireError(err);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [state.currentPage, state.filter, state.sortOption, state.starFilters]);

    const handleFilterChange = (e) => dispatch({ type: 'SET_FILTER', payload: e.target.value });
    const handleSortChange = (e) => dispatch({ type: 'SET_SORT', payload: e.target.value });
    const handleStarFilterChange = (checkedValues) => dispatch({ type: 'SET_STAR_FILTERS', payload: checkedValues });
    // const handlePageChange = (page) => dispatch({ type: 'SET_PAGE', payload: page });
    const handleWriteReviewClick = () => dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: true });

    return (
        <>
            <div className={styles.reviewsSectionContainer}>

                {/* Write Review */}
                {isForPlace && !isOwner &&
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WriteReviewCard handleOpenModal={handleWriteReviewClick} />
                    </div>
                }


                <div className={styles.filterReviewsCard}>

                    <Typography.Title
                        level={3}
                        style={{
                            textAlign: 'left',
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                            fontWeight: 700,
                            fontSize: '2.2rem',
                            letterSpacing: '0.4px',
                            color: '#1A7F64',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.6rem',
                            width: '100%',
                            marginTop: '0'
                        }}
                    >
                        <span
                            style={{
                                backgroundColor: '#ffffff',
                                borderRadius: '50%',
                                padding: '0.5rem',
                                boxShadow: '0 3px 8px rgba(0, 0, 0, 0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <StarFilled style={{ color: '#1A7F64', fontSize: '2rem' }} />
                        </span>
                        Reviews ({state.reviewsCount})
                    </Typography.Title>

                    {!isForPlace && (
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Radio: {
                                            colorPrimary: '#78c57b',
                                            buttonBg: '#fff',
                                            buttonColor: '#2d6a2e',
                                            buttonSolidCheckedBg: '#78c57b',
                                            buttonSolidCheckedColor: 'white',
                                            buttonSolidCheckedHoverBg: '#65b36d',
                                            buttonSolidCheckedActiveBg: '#4f9d53',
                                            borderRadius: 12,
                                        }
                                    }
                                }}
                            >
                                <div className="radio-large" style={{ width: '100%' }}>
                                    <Radio.Group
                                        options={stateOptions}
                                        defaultValue={stateOptions}
                                        optionType="button"
                                        value={state.filter}
                                        buttonStyle="solid"
                                        size="large"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: '1rem',
                                            flexWrap: 'wrap',
                                            padding: '0 5rem'
                                        }}
                                        onChange={handleFilterChange}
                                        name="Sort"
                                    />
                                </div>
                            </ConfigProvider>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Radio: {
                                        colorPrimary: '#78c57b',
                                        buttonBg: '#fff',
                                        buttonColor: '#2d6a2e',
                                        buttonSolidCheckedBg: '#78c57b',
                                        buttonSolidCheckedColor: 'white',
                                        buttonSolidCheckedHoverBg: '#65b36d',
                                        buttonSolidCheckedActiveBg: '#4f9d53',
                                        borderRadius: 12,
                                    }
                                }
                            }}
                        >
                            <div className="radio-large" style={{ width: '100%', marginTop: '1rem' }}>
                                <Radio.Group
                                    options={sortOptions}
                                    defaultValue={state.sortOption}
                                    optionType="button"
                                    value={state.sortOption}
                                    buttonStyle="solid"
                                    size="large"
                                    disabled={state.reviewsCount <= 1}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '1rem',
                                        flexWrap: 'wrap',
                                        padding: '0 5rem'
                                    }}
                                    onChange={handleSortChange}
                                    name="Sort"
                                />
                            </div>
                        </ConfigProvider>

                    </div>

                    <div className={styles.customCheckboxGroupWrapper}>
                        <Checkbox.Group
                            value={state.starFilters}
                            onChange={handleStarFilterChange}
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                justifyContent: 'center',
                                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                                width: '100%'
                            }}
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Checkbox key={star} value={star} className={styles.pillCheckbox}>
                                    <StarFilled style={{ color: '#fadb14' }} /> Show {star} star{star > 1 ? 's' : ''}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </div>

                </div>



                {/* Upload Review Modal */}
                {isForPlace && placeId && (
                    <UploadReviewModal
                        isModalOpen={state.isUploadReviewModalOpen}
                        placeId={placeId}
                        reviewService={reviewsService}
                        setIsModalOpen={(isOpen) => dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: isOpen })}
                    />
                )}

                {/* Reviews List */}
                {state.spinnerLoading
                    ? renderSpinner(state.spinnerLoading, isForAdmin)
                    : (state.reviews?.length > 0
                        ? (
                            <ReviewsList
                                reviews={state.reviews}
                                isForAdmin={isForAdmin}
                                isForPlace={isForPlace}
                                isForUser={isForUser}
                                setReviews={(newReviews) =>
                                    dispatch({
                                        type: 'SET_REVIEWS',
                                        payload: {
                                            reviews: newReviews,
                                            reviewsCount: state.reviewsCount,
                                            pagesCount: state.pagesCount,
                                        },
                                    })
                                }
                            />
                        ) : renderEmptyState(isForAdmin))}

                {/* Pagination */}
                {
                    !state.spinnerLoading && state.pagesCount > 1 &&
                    <Pagination
                        currentPage={state.currentPage}
                        handlePageChange={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
                        isForAdmin={isForAdmin}
                        pagesCount={state.pagesCount}
                    />
                }
            </div>

        </>
    )

};

export default ReviewsSection;