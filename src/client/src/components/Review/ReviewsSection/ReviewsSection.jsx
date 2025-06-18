import styles from './ReviewsSection.module.css';
import { useContext, useEffect, useReducer } from "react";
import { reviewsServiceFactory } from "../../../services/reviewsService";
import { AuthContext } from "../../../contexts/AuthContext";
import { renderEmptyState, renderSpinner } from '../reviewsUtil';
import ReviewsList from "../ReviewsList";
import WriteReviewCard from '../WriteReviewCard';
import UploadReviewModal from '../Modals/UploadReviewModal';
import { Typography, Radio, ConfigProvider, Checkbox, Avatar } from "antd";
import Pagination from '../../Pagination/Pagination';
import { StarFilled, UserOutlined } from '@ant-design/icons';
import { entityState } from '../../../constants/entityState';
import { fireError } from '../../../utils/fireError';
import { initialState, reviewsReducer } from './reviewsSectionUtil';

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

const ReviewsSection = ({
    isForAdmin = false,
    isForPlace = true,
    isForUser = false,
    placeId = null,
    isOwner,
    isForFollowedUser = false,
    followedUser = null
}) => {
    const { token, profileImageUrl } = useContext(AuthContext);
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
            } else if (isForFollowedUser && followedUser) {
                response = await reviewsService.getFollowedUserReviews(currentPage, sortOption, starFilters, followedUser.id)
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
    const handleWriteReviewClick = () => dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: true });

    const customTheme = isForAdmin
        ? {
            components: {
                Radio: {
                    colorPrimary: '#888',
                    colorText: '#f0f0f0',
                    buttonSolidCheckedBg: '#888',
                    buttonSolidCheckedColor: '#fff',
                    colorBorder: '#555',
                    borderRadius: 8,
                    fontSize: 16,
                },
                Checkbox: {
                    colorPrimary: '#fadb14',
                    borderRadius: 8,
                    colorBgContainer: '#2b2b3d',
                    colorText: '#f0f0f0',
                    colorBorder: '#fadb14',
                    colorPrimaryHover: '#ffe58f',
                }
            }
        }
        : {
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
                },
                Checkbox: {
                    colorPrimary: '#1a7f64',
                    borderRadius: 8,
                }
            }
        };


    return (
        <div className={styles.reviewsSectionContainer}>
            {isForPlace && !isOwner && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <WriteReviewCard handleOpenModal={handleWriteReviewClick} />
                </div>
            )}

            <div className={`${styles.filterReviewsCard} ${isForAdmin ? styles.adminFilterCard : ''}`}>
                <Typography.Title
                    level={3}
                    style={{
                        textAlign: 'center',
                        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                        fontWeight: 700,
                        fontSize: '1.7rem',
                        letterSpacing: '0.4px',
                        color: isForAdmin ? '#fff' : '#1A7F64',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.6rem',
                        width: '100%',
                        marginTop: '0',
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
                        <StarFilled style={{ color: isForAdmin ? '#2b2b3d' : '#1A7F64', fontSize: '1.5rem' }} />
                    </span>

                    {isForPlace && `Reviews (${state.reviewsCount})`}
                    {isForUser && `My Reviews (${state.reviewsCount})`}
                    {isForAdmin && `${state.filter} Reviews (${state.reviewsCount})`}

                    {/* {isForFollowedUser && (
                        <>
                            <Avatar size={60} src={followedUser.profileImageUrl} />
                            <span>{followedUser.userName} Reviews</span>
                        </>
                    )} */}

                    {isForFollowedUser && (
                        <>
                            <Avatar
                                size={60}
                                src={followedUser.profileImageUrl && followedUser.profileImageUrl.trim() !== '' ? followedUser.profileImageUrl : null}
                                icon={!followedUser.profileImageUrl || followedUser.profileImageUrl.trim() === '' ? <UserOutlined /> : undefined}
                            />
                            <span>{followedUser.userName} Reviews</span>
                        </>
                    )}

                </Typography.Title>

                <div style={{ display: 'flex', justifyContent: !isForFollowedUser && !isForPlace ? 'space-between' : ' center', width: '100%' }}>

                    <ConfigProvider theme={customTheme}>

                        <Radio.Group
                            name="Sort"
                            options={sortOptions}
                            value={state.sortOption}
                            onChange={handleSortChange}
                            className={styles.radioGroup}
                            disabled={state.reviewsCount <= 1}
                        >
                            {sortOptions.map((opt) => (
                                <Radio key={opt.value} value={opt.value} className={styles.radioOption}>
                                    {opt.label}
                                </Radio>
                            ))}
                        </Radio.Group>

                    </ConfigProvider>

                    {!isForFollowedUser && !isForPlace && (
                        <ConfigProvider theme={customTheme}>
                            <div>
                                <Radio.Group
                                    name="Filter"
                                    options={stateOptions}
                                    value={state.filter}
                                    onChange={handleFilterChange}
                                    className={styles.radioGroup}
                                />
                            </div>
                        </ConfigProvider>
                    )}

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

            {isForPlace && placeId && (
                <UploadReviewModal
                    isModalOpen={state.isUploadReviewModalOpen}
                    placeId={placeId}
                    reviewService={reviewsService}
                    setIsModalOpen={(isOpen) => dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: isOpen })}
                />
            )}

            {state.spinnerLoading
                ? renderSpinner(state.spinnerLoading, isForAdmin)
                : (state.reviews?.length > 0
                    ? (
                        <ReviewsList
                            reviews={state.reviews}
                            isForAdmin={isForAdmin}
                            isForPlace={isForPlace}
                            isForUser={isForUser}
                            setReviews={(newReviewsOrUpdater) => {
                                const updatedReviews = typeof newReviewsOrUpdater === 'function'
                                    ? newReviewsOrUpdater(state.reviews)
                                    : newReviewsOrUpdater;

                                dispatch({
                                    type: 'SET_REVIEWS',
                                    payload: {
                                        reviews: updatedReviews,
                                        reviewsCount: state.reviewsCount,
                                        pagesCount: state.pagesCount,
                                    },
                                });
                            }}
                            isForFollowedUser={isForFollowedUser}
                            onRefresh={() => {
                                dispatch({ type: 'SET_PAGE', payload: 1 });
                                fetchReviews();
                            }}
                        />
                    ) : renderEmptyState(isForAdmin))}

            {!state.spinnerLoading && state.pagesCount > 1 && (
                <Pagination
                    currentPage={state.currentPage}
                    handlePageChange={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
                    isForAdmin={isForAdmin}
                    pagesCount={state.pagesCount}
                />
            )}
        </div>
    );
};

export default ReviewsSection;
