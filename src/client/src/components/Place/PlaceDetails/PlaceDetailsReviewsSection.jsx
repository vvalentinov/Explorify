import styles from './PlaceDetailsReviewsSection.module.css';

import { useContext, useEffect, useReducer } from "react";

import { reviewsServiceFactory } from "../../../services/reviewsService";

import { AuthContext } from "../../../contexts/AuthContext";

import { renderEmptyState, renderSpinner } from '../../Review/reviewsUtil';

import { sortOptions } from '../../../constants/sortOptions';

import WriteReviewCard from '../../Review/WriteReviewCard';
import UploadReviewModal from '../../Review/Modals/UploadReviewModal';

import { Typography, Radio, ConfigProvider, Checkbox } from "antd";

import Pagination from '../../Pagination/Pagination';

import { StarFilled } from '@ant-design/icons';

import { fireError } from '../../../utils/fireError';

import ReviewsList from '../../Review/ReviewsList';

const reviewsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_REVIEWS':
            return {
                ...state,
                reviews: action.payload.reviews,
                reviewsCount: action.payload.reviewsCount,
                pagesCount: action.payload.pagesCount,
                spinnerLoading: false,
            };
        case 'SET_LOADING':
            return { ...state, spinnerLoading: true };
        case 'SET_SORT':
            return { ...state, sortOption: action.payload, currentPage: 1 };
        case 'SET_STAR_FILTERS':
            return { ...state, starFilters: action.payload, currentPage: 1 };
        case 'SET_PAGE':
            return { ...state, currentPage: action.payload };
        case 'TOGGLE_UPLOAD_MODAL':
            return { ...state, isUploadReviewModalOpen: action.payload };
        default:
            return state;
    }
}

const PlaceDetailsReviewsSection = ({ placeId, isOwner }) => {

    const { token } = useContext(AuthContext);

    const reviewsService = reviewsServiceFactory(token);

    const [state, dispatch] = useReducer(
        reviewsReducer,
        {
            reviews: [],
            spinnerLoading: false,
            pagesCount: 0,
            currentPage: 1,
            reviewsCount: 0,
            sortOption: "Newest",
            starFilters: [],
            isUploadReviewModalOpen: false,
        }
    );

    const fetchReviews = async () => {

        dispatch({ type: 'SET_LOADING' });

        try {

            let response;

            const { currentPage, sortOption, starFilters } = state;

            response = await reviewsService.getPlaceReviews(placeId, currentPage, sortOption, starFilters);

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

    useEffect(() => { fetchReviews(); },
        [
            state.currentPage,
            state.filter,
            state.sortOption,
            state.starFilters
        ]);

    const handleSortChange = (e) => dispatch({ type: 'SET_SORT', payload: e.target.value });
    const handleStarFilterChange = (checkedValues) => dispatch({ type: 'SET_STAR_FILTERS', payload: checkedValues });
    const handleWriteReviewClick = () => dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: true });

    return (
        <>
            <div className={styles.reviewsSectionContainer}>

                {/* Write Review */}
                {!isOwner &&
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WriteReviewCard handleOpenModal={handleWriteReviewClick} />
                    </div>
                }

                <div className={styles.filterReviewsCard}>

                    <Typography.Title
                        level={3}
                        style={{
                            textAlign: 'center',
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                            fontWeight: 700,
                            fontSize: '1.7rem',
                            letterSpacing: '0.4px',
                            color: '#1A7F64',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.6rem',
                            width: '100%',
                            marginTop: '0',
                            // border: 'solid 1px red'
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
                            <StarFilled style={{ color: '#1A7F64', fontSize: '1.5rem' }} />
                        </span>
                        Reviews ({state.reviewsCount})
                    </Typography.Title>

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
                            <div>
                                <Radio.Group
                                    name="Sort"
                                    options={sortOptions}
                                    defaultValue={state.sortOption}
                                    value={state.sortOption}
                                    onChange={handleSortChange}
                                    className={styles.radioGroup}
                                    disabled={state.reviewsCount <= 1}
                                />
                            </div>
                        </ConfigProvider>

                    </div>

                    <div className={`${styles.customCheckboxGroupWrapper} ${styles.starPillCheckbox}`}>
                        <Checkbox.Group
                            value={state.starFilters}
                            onChange={handleStarFilterChange}
                            className={styles.checkboxGroup}
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Checkbox className={styles.checkbox} key={star} value={star}>
                                    {Array.from({ length: star }, (_, i) => (
                                        <StarFilled key={i} style={{ color: '#fadb14' }} />
                                    ))}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </div>


                </div>

                <UploadReviewModal
                    isModalOpen={state.isUploadReviewModalOpen}
                    placeId={placeId}
                    reviewService={reviewsService}
                    setIsModalOpen={(isOpen) => dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: isOpen })}
                />

                {/* Reviews List */}
                {state.spinnerLoading
                    ? renderSpinner(state.spinnerLoading, false)
                    : (state.reviews?.length > 0
                        ? (
                            <ReviewsList
                                reviews={state.reviews}
                                isForAdmin={false}
                                isForPlace={true}
                                isForUser={false}
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
                        ) : renderEmptyState(false))}

                {/* Pagination */}
                {
                    !state.spinnerLoading && state.pagesCount > 1 &&
                    <Pagination
                        currentPage={state.currentPage}
                        handlePageChange={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
                        isForAdmin={false}
                        pagesCount={state.pagesCount}
                    />
                }

            </div>
        </>
    )

};

export default PlaceDetailsReviewsSection;