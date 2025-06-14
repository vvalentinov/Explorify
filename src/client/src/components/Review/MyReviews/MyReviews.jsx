// import styles from './ReviewsSection/ReviewsSection.module.css';

// import { useContext, useEffect, useReducer } from "react";

// import { reviewsServiceFactory } from "../../services/reviewsService";

// import { AuthContext } from "../../contexts/AuthContext";

// import { renderEmptyState, renderSpinner } from './reviewsUtil';

// import ReviewsList from "./ReviewsList";

// const sortOptions = [
//     { label: 'Newest', value: 'Newest' },
//     { label: 'Oldest', value: 'Oldest' },
//     { label: 'Most Helpful', value: 'MostHelpful' },
// ];

// const stateOptions = [
//     { label: 'Approved', value: 'Approved' },
//     { label: 'Unapproved', value: 'Unapproved' },
//     { label: 'Recently Deleted', value: 'Deleted' },
// ];

// import { Typography, Radio, ConfigProvider, Checkbox } from "antd";

// import Pagination from '../Pagination/Pagination';

// import { StarFilled } from '@ant-design/icons';

// import { entityState } from '../../constants/entityState';
// import { fireError } from '../../utils/fireError';

// export const initialState = {
//     reviews: [],
//     spinnerLoading: false,
//     filter: entityState.Approved,
//     pagesCount: 0,
//     currentPage: 1,
//     reviewsCount: 0,
//     sortOption: "Newest",
//     starFilters: [],
// };

// export const reviewsReducer = (state, action) => {
//     switch (action.type) {
//         case 'SET_REVIEWS':
//             return {
//                 ...state,
//                 reviews: action.payload.reviews,
//                 reviewsCount: action.payload.reviewsCount,
//                 pagesCount: action.payload.pagesCount,
//                 spinnerLoading: false,
//             };
//         case 'SET_LOADING':
//             return { ...state, spinnerLoading: true };
//         case 'SET_FILTER':
//             return { ...state, filter: action.payload, currentPage: 1 };
//         case 'SET_SORT':
//             return { ...state, sortOption: action.payload, currentPage: 1 };
//         case 'SET_STAR_FILTERS':
//             return { ...state, starFilters: action.payload, currentPage: 1 };
//         case 'SET_PAGE':
//             return { ...state, currentPage: action.payload };
//         default:
//             return state;
//     }
// }

// const MyReviews = () => {

//     const { token } = useContext(AuthContext);

//     const reviewsService = reviewsServiceFactory(token);

//     const [state, dispatch] = useReducer(reviewsReducer, initialState);

//     const fetchReviews = async () => {

//         dispatch({ type: 'SET_LOADING' });

//         try {
//             let response;

//             const { filter, currentPage, sortOption, starFilters } = state;

//             const isApproved = filter === entityState.Approved;
//             const isUnapproved = filter === entityState.Unapproved;
//             const isDeleted = filter === entityState.Deleted;

//             if (isApproved) {
//                 response = await reviewsService.getApproved(currentPage, false, sortOption, starFilters);
//             } else if (isUnapproved) {
//                 response = await reviewsService.getUnapproved(currentPage, false, sortOption, starFilters);
//             } else if (isDeleted) {
//                 response = await reviewsService.getDeleted(currentPage, false, sortOption, starFilters);
//             }


//             dispatch({
//                 type: 'SET_REVIEWS',
//                 payload: {
//                     reviews: response?.reviews ?? [],
//                     reviewsCount: response?.pagination?.recordsCount ?? 0,
//                     pagesCount: response?.pagination?.pagesCount ?? 0,
//                 }
//             });
//         } catch (err) {
//             console.error('Failed to fetch reviews:', err);
//             fireError(err);
//             dispatch({ type: 'SET_LOADING', payload: false });
//         }
//     };

//     useEffect(() => {
//         fetchReviews();
//     },
//         [
//             state.currentPage,
//             state.filter,
//             state.sortOption,
//             state.starFilters
//         ]);

//     const handleFilterChange = (e) => dispatch({ type: 'SET_FILTER', payload: e.target.value });
//     const handleSortChange = (e) => dispatch({ type: 'SET_SORT', payload: e.target.value });
//     const handleStarFilterChange = (checkedValues) => dispatch({ type: 'SET_STAR_FILTERS', payload: checkedValues });

//     return (
//         <>
//             <div className={styles.reviewsSectionContainer}>

//                 <div className={styles.filterReviewsCard}>

//                     <Typography.Title
//                         level={3}
//                         style={{
//                             textAlign: 'left',
//                             fontFamily: "'Poppins', 'Segoe UI', sans-serif",
//                             fontWeight: 700,
//                             fontSize: '2.2rem',
//                             letterSpacing: '0.4px',
//                             color: '#1A7F64',
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             gap: '0.6rem',
//                             width: '100%',
//                             marginTop: '0'
//                         }}
//                     >
//                         <span
//                             style={{
//                                 backgroundColor: '#ffffff',
//                                 borderRadius: '50%',
//                                 padding: '0.5rem',
//                                 boxShadow: '0 3px 8px rgba(0, 0, 0, 0.12)',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                             }}
//                         >
//                             <StarFilled style={{ color: '#1A7F64', fontSize: '2rem' }} />
//                         </span>
//                         Reviews ({state.reviewsCount})
//                     </Typography.Title>

//                     <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
//                         <ConfigProvider
//                             theme={{
//                                 components: {
//                                     Radio: {
//                                         colorPrimary: '#78c57b',
//                                         buttonBg: '#fff',
//                                         buttonColor: '#2d6a2e',
//                                         buttonSolidCheckedBg: '#78c57b',
//                                         buttonSolidCheckedColor: 'white',
//                                         buttonSolidCheckedHoverBg: '#65b36d',
//                                         buttonSolidCheckedActiveBg: '#4f9d53',
//                                         borderRadius: 12,
//                                     }
//                                 }
//                             }}
//                         >
//                             <div className="radio-large" style={{ width: '100%' }}>
//                                 <Radio.Group
//                                     options={stateOptions}
//                                     defaultValue={stateOptions}
//                                     optionType="button"
//                                     value={state.filter}
//                                     buttonStyle="solid"
//                                     size="large"
//                                     style={{
//                                         display: 'flex',
//                                         justifyContent: 'center',
//                                         gap: '1rem',
//                                         flexWrap: 'wrap',
//                                         padding: '0 5rem'
//                                     }}
//                                     onChange={handleFilterChange}
//                                     name="Sort"
//                                 />
//                             </div>
//                         </ConfigProvider>
//                     </div>

//                     <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
//                         <ConfigProvider
//                             theme={{
//                                 components: {
//                                     Radio: {
//                                         colorPrimary: '#78c57b',
//                                         buttonBg: '#fff',
//                                         buttonColor: '#2d6a2e',
//                                         buttonSolidCheckedBg: '#78c57b',
//                                         buttonSolidCheckedColor: 'white',
//                                         buttonSolidCheckedHoverBg: '#65b36d',
//                                         buttonSolidCheckedActiveBg: '#4f9d53',
//                                         borderRadius: 12,
//                                     }
//                                 }
//                             }}
//                         >
//                             <div className="radio-large" style={{ width: '100%', marginTop: '1rem' }}>
//                                 <Radio.Group
//                                     options={sortOptions}
//                                     defaultValue={state.sortOption}
//                                     optionType="button"
//                                     value={state.sortOption}
//                                     buttonStyle="solid"
//                                     size="large"
//                                     disabled={state.reviewsCount <= 1}
//                                     style={{
//                                         display: 'flex',
//                                         justifyContent: 'center',
//                                         gap: '1rem',
//                                         flexWrap: 'wrap',
//                                         padding: '0 5rem'
//                                     }}
//                                     onChange={handleSortChange}
//                                     name="Sort"
//                                 />
//                             </div>
//                         </ConfigProvider>

//                     </div>

//                     <div className={styles.customCheckboxGroupWrapper}>
//                         <Checkbox.Group
//                             value={state.starFilters}
//                             onChange={handleStarFilterChange}
//                             style={{
//                                 display: 'flex',
//                                 flexWrap: 'wrap',
//                                 gap: '1rem',
//                                 justifyContent: 'center',
//                                 fontFamily: "'Poppins', 'Segoe UI', sans-serif",
//                                 width: '100%'
//                             }}
//                         >
//                             {[1, 2, 3, 4, 5].map((star) => (
//                                 <Checkbox key={star} value={star} className={styles.pillCheckbox}>
//                                     <StarFilled style={{ color: '#fadb14' }} /> Show {star} star{star > 1 ? 's' : ''}
//                                 </Checkbox>
//                             ))}
//                         </Checkbox.Group>
//                     </div>

//                 </div>

//                 {/* Reviews List */}
//                 {state.spinnerLoading
//                     ? renderSpinner(state.spinnerLoading, false)
//                     : (state.reviews?.length > 0
//                         ? (
//                             <ReviewsList
//                                 reviews={state.reviews}
//                                 isForAdmin={false}
//                                 isForPlace={false}
//                                 isForUser={true}
//                                 setReviews={(newReviews) =>
//                                     dispatch({
//                                         type: 'SET_REVIEWS',
//                                         payload: {
//                                             reviews: newReviews,
//                                             reviewsCount: state.reviewsCount,
//                                             pagesCount: state.pagesCount,
//                                         },
//                                     })
//                                 }
//                             />
//                         ) : renderEmptyState(false))}

//                 {/* Pagination */}
//                 {
//                     !state.spinnerLoading && state.pagesCount > 1 &&
//                     <Pagination
//                         currentPage={state.currentPage}
//                         handlePageChange={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
//                         isForAdmin={false}
//                         pagesCount={state.pagesCount}
//                     />
//                 }
//             </div>

//         </>
//     )

// };

// export default MyReviews;

import styles from './MyReviews.module.css';

import { useContext, useEffect, useReducer, useState } from "react";
import { reviewsServiceFactory } from "../../../services/reviewsService";
import { AuthContext } from "../../../contexts/AuthContext";
import { renderEmptyState, renderSpinner } from '../reviewsUtil';

import MyReviewsList from "../MyReviews/MyReviewsList";
import Pagination from '../../Pagination/Pagination';

import { Typography, Radio, ConfigProvider, Checkbox, Layout, Divider, Empty } from "antd";
import { StarFilled, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

import { entityState } from '../../../constants/entityState';
import { fireError } from '../../../utils/fireError';

const { Sider, Content } = Layout;

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

const initialState = {
    reviews: [],
    spinnerLoading: false,
    filter: entityState.Approved,
    pagesCount: 0,
    currentPage: 1,
    reviewsCount: 0,
    recordsCount: 0, // ✅ Add this
    sortOption: "Newest",
    starFilters: [],
};

const reviewsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_REVIEWS':
            return { ...state, ...action.payload, spinnerLoading: false };
        case 'SET_LOADING':
            return { ...state, spinnerLoading: true };
        case 'SET_FILTER':
            return { ...state, filter: action.payload, currentPage: 1 };
        case 'SET_SORT':
            return { ...state, sortOption: action.payload, currentPage: 1 };
        case 'SET_STAR_FILTERS':
            return { ...state, starFilters: action.payload, currentPage: 1 };
        case 'SET_PAGE':
            return { ...state, currentPage: action.payload };
        default:
            return state;
    }
};

const MyReviews = () => {

    const { token } = useContext(AuthContext);

    const reviewsService = reviewsServiceFactory(token);

    const [state, dispatch] = useReducer(reviewsReducer, initialState);

    const fetchReviews = async () => {

        dispatch({ type: 'SET_LOADING' });

        try {
            const { filter, currentPage, sortOption, starFilters } = state;
            let response;

            switch (filter) {
                case entityState.Approved:
                    response = await reviewsService.getApproved(currentPage, false, sortOption, starFilters);
                    break;
                case entityState.Unapproved:
                    response = await reviewsService.getUnapproved(currentPage, false, sortOption, starFilters);
                    break;
                case entityState.Deleted:
                    response = await reviewsService.getDeleted(currentPage, false, sortOption, starFilters);
                    break;
            }

            dispatch({
                type: 'SET_REVIEWS',
                payload: {
                    reviews: response?.reviews ?? [],
                    reviewsCount: response?.pagination?.recordsCount ?? 0,
                    pagesCount: response?.pagination?.pagesCount ?? 0,
                    recordsCount: response?.pagination?.recordsCount ?? 0,
                }
            });

        } catch (err) {
            console.error('Failed to fetch reviews:', err);
            fireError(err);
        }
    };

    useEffect(() => { fetchReviews(); }, [state.currentPage, state.filter, state.sortOption, state.starFilters]);

    const handleFilterChange = (e) => dispatch({ type: 'SET_FILTER', payload: e.target.value });
    const handleSortChange = (e) => dispatch({ type: 'SET_SORT', payload: e.target.value });
    const handleStarFilterChange = (values) => dispatch({ type: 'SET_STAR_FILTERS', payload: values });

    const getFilterLabel = () => {
        switch (state.filter) {
            case entityState.Approved:
                return 'Approved Reviews';
            case entityState.Unapproved:
                return 'Unapproved Reviews';
            case entityState.Deleted:
                return 'Recently Deleted Reviews';
            default:
                return 'My Reviews';
        }
    };


    return (
        <Layout className={styles.layoutContainer}>

            <Sider
                width={300}
                className={styles.sidebar}
                breakpoint="lg"
            >

                <div className={styles.sidebarContent}>

                    <div>
                        <Typography.Title level={4} className={styles.sidebarTitle}>Filter</Typography.Title>

                        <Radio.Group
                            options={stateOptions}
                            value={state.filter}
                            onChange={handleFilterChange}
                            className={styles.radioGroup}
                        />
                    </div>

                    <Divider className={styles.divider} />

                    <div>
                        <Typography.Title level={4} className={styles.sidebarTitle}>Sort</Typography.Title>

                        <Radio.Group
                            options={sortOptions}
                            value={state.sortOption}
                            onChange={handleSortChange}
                            className={styles.radioGroup}
                            disabled={state.reviewsCount <= 1}
                        />

                    </div>

                    <div>

                        <Typography.Title level={5} className={styles.sidebarTitle}>Filter by Stars</Typography.Title>

                        <Checkbox.Group
                            value={state.starFilters}
                            onChange={handleStarFilterChange}
                            className={styles.checkboxGroup}
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Checkbox key={star} value={star} className={styles.checkbox}>
                                    {Array.from({ length: star }, (_, i) => (
                                        <StarFilled key={i} style={{ color: '#fadb14' }} />
                                    ))}
                                </Checkbox>

                            ))}
                        </Checkbox.Group>

                    </div>

                </div>
            </Sider>


            <Content className={styles.mainContent}>

                <Typography.Title level={3} className={styles.pageTitle}>
                    <StarFilled className={styles.pageIcon} /> My {getFilterLabel()} ({state.reviewsCount})
                </Typography.Title>

                <section className={styles.reviewsSection}>

                    {state.spinnerLoading
                        ? renderSpinner(true, false)
                        : state.reviews.length > 0
                            ? <MyReviewsList
                                reviews={state.reviews}
                                isForAdmin={false}
                                isForPlace={false}
                                isForUser={true}
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
                            : <Empty
                                style={{
                                    minHeight: '600px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    margin: '0',
                                    // border: 'solid 1px black'
                                }}
                                description={
                                    <span style={{ fontSize: '2rem', fontWeight: 500, fontFamily: 'Poppins, Segoe UI, sans-serif', }}>
                                        No reviews found!
                                    </span>
                                }
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                    }

                </section>




                {!state.spinnerLoading && state.pagesCount > 1 && (
                    <Pagination
                        currentPage={state.currentPage}
                        handlePageChange={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
                        isForAdmin={false}
                        pagesCount={state.pagesCount}
                    />
                )}

            </Content>

        </Layout>
    );
};

export default MyReviews;