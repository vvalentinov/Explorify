// import styles from './MyReviews.module.css';

// import { usersServiceFactory } from "../../../services/usersService";
// import { reviewsServiceFactory } from '../../../services/reviewsService';

// import { useState, useEffect, useContext } from "react";


// import { AuthContext } from '../../../contexts/AuthContext';

// import { fireError } from "../../../utils/fireError";

// import {
//     Pagination,
//     Spin,
//     ConfigProvider,
//     Card,
//     Button,
//     Modal,
//     App,
//     Typography,
//     Radio,
//     Empty,
//     Avatar,
//     Rate,
//     Image
// } from "antd";

// import { PictureOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// import { useNavigate } from 'react-router-dom';

// const options = [
//     { label: 'Approved', value: 'approved' },
//     { label: 'Unapproved', value: 'unapproved' },
//     { label: 'Recently Deleted', value: 'recentlyDeleted' },
// ];

// import DeleteReviewModal from '../Modals/DeleteReviewModal';

// const MyReviews = () => {

//     const navigate = useNavigate();

//     const { token } = useContext(AuthContext);

//     const userService = usersServiceFactory(token);
//     const reviewsService = reviewsServiceFactory(token);

//     const [reviews, setReviews] = useState([]);
//     const [pagesCount, setPagesCount] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [spinnerLoading, setSpinnerLoading] = useState(false);

//     const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

//     const [selectedReview, setSelectedReview] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const [filter, setFilter] = useState('approved');

//     const fetchReviews = async () => {

//         setSpinnerLoading(true);

//         try {

//             let response;

//             if (filter === 'approved') {
//                 response = await reviewsService.getApproved(currentPage, false);
//             } else if (filter === 'unapproved') {
//                 response = await reviewsService.getUnapproved(currentPage, false);
//             } else if (filter === 'recentlyDeleted') {
//                 response = await reviewsService.getDeleted(currentPage, false);
//             }

//             setPagesCount(response.pagination.pagesCount);
//             setReviews(response.reviews);
//             setSpinnerLoading(false);

//         } catch (err) {
//             fireError(err);
//             setSpinnerLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchReviews();
//     }, [filter, currentPage]);

//     useEffect(() => {

//         if (reviews.length > 0) {
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//         }

//     }, [reviews]);

//     const handlePageChange = (page) => setCurrentPage(page);
//     const handleSortChange = (e) => {
//         setFilter(e.target.value);
//         setCurrentPage(1);
//     };

//     const handleOpenModal = (review) => {
//         setSelectedReview(review);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setSelectedReview(null);
//     };

//     const handleDelete = (review) => {
//         setIsDeleteModalVisible(true);
//         setSelectedReview(review);
//     }

//     return (
//         <>
//             <div
//                 style={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     width: '100%'
//                 }}
//             >
//                 <Card
//                     style={{
//                         width: '60%',
//                         padding: '1rem 2rem',
//                         backgroundColor: '#f3e9fe',
//                         border: '1px solid #9c4dcc',
//                         borderRadius: '16px',
//                         boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
//                         textAlign: 'center',
//                         marginTop: '2rem'
//                     }}
//                 >
//                     <ConfigProvider
//                         theme={{
//                             components: {
//                                 Radio: {
//                                     colorPrimary: '#9c4dcc',
//                                     buttonBg: '#e6d4f5',
//                                     buttonColor: '#6a2c91',
//                                     buttonSolidCheckedBg: '#9c4dcc',
//                                     buttonSolidCheckedColor: 'white',
//                                     buttonSolidCheckedHoverBg: '#8a3dac',
//                                     buttonSolidCheckedActiveBg: '#9c4dcc',
//                                     borderRadius: 12,
//                                 },
//                             },
//                         }}
//                     >
//                         <Typography.Paragraph italic={true}>
//                             Filter Reviews
//                         </Typography.Paragraph>

//                         <Radio.Group
//                             options={options}
//                             defaultValue={filter}
//                             optionType="button"
//                             value={filter}
//                             buttonStyle="solid"
//                             size="large"
//                             style={{
//                                 width: '100%',
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 gap: '1rem',
//                                 flexWrap: 'wrap',
//                             }}
//                             onChange={handleSortChange}
//                             name='Sort'
//                         />
//                     </ConfigProvider>
//                 </Card>
//             </div>

//             <div className={styles.reviewsContainer}>

//                 {
//                     spinnerLoading ? (
//                         <ConfigProvider theme={{
//                             components: {
//                                 Spin: { colorPrimary: 'green' }
//                             }
//                         }}>
//                             <Spin size='large' spinning={spinnerLoading} />
//                         </ConfigProvider>
//                     ) : reviews.length === 0 ? (
//                         <Empty description="No reviews yet." />
//                     ) : (
//                         reviews.map(x => (
//                             <Card
//                                 key={x.id}
//                                 style={{
//                                     overflow: 'hidden',
//                                     boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.06)'
//                                 }}
//                                 styles={{
//                                     header: {
//                                         backgroundColor: '#4caf50',
//                                     }
//                                 }}
//                                 className={styles.reviewCard}
//                                 title={
//                                     <div className={styles.reviewCardHeader}>
//                                         <div className={styles.reviewCardHeaderContainer}>
//                                             <Avatar
//                                                 src={x.profileImageUrl || undefined}
//                                                 size={40}
//                                                 icon={!x.profileImageUrl && <UserOutlined />}
//                                             />
//                                             <span style={{ marginLeft: '5px' }} className={styles.placeTitle}>{x.userName}</span>
//                                         </div>
//                                         <div>
//                                             <Rate style={{ padding: '0', margin: '0' }} disabled value={x.rating} />
//                                         </div>
//                                     </div>
//                                 }
//                             >
//                                 <Typography.Paragraph
//                                     style={{ textAlign: 'justify' }}
//                                     ellipsis={{ rows: 5 }}
//                                 >
//                                     {x.content}
//                                 </Typography.Paragraph>

//                                 <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', flexWrap: 'wrap' }}>

//                                     <Button icon={<EyeOutlined />} variant='solid' color='cyan' onClick={() => handleOpenModal(x)}>
//                                         Open
//                                     </Button>

//                                     {
//                                         !x.isDeleted &&
//                                         <>
//                                             <Button
//                                                 icon={<EditOutlined />}
//                                                 variant='solid'
//                                                 color='gold'
//                                                 onClick={() => navigate('/review/edit', { state: { reviewId: x.id } })}
//                                             >
//                                                 Edit
//                                             </Button>
//                                             <Button
//                                                 icon={<DeleteOutlined />}
//                                                 variant='solid'
//                                                 color='danger'
//                                                 onClick={() => handleDelete(x)}
//                                             >
//                                                 Delete
//                                             </Button>
//                                         </>
//                                     }

//                                     {
//                                         x.isDeleted && !x.isDeletedByAdmin &&
//                                         <Button type="primary" onClick={() => handleRevert(x.id)}>
//                                             Revert
//                                         </Button>
//                                     }

//                                 </div>

//                             </Card>
//                         )
//                         )
//                     )
//                 }

//             </div >

//             {pagesCount > 1 && !spinnerLoading &&
//                 <ConfigProvider theme={{
//                     components: {
//                         Pagination: {
//                             itemActiveBg: '#e8fffb',
//                             itemActiveColor: '#52c41a',
//                             colorPrimary: '#52c41a',
//                             colorPrimaryHover: '#389e0d',
//                         },
//                     }
//                 }}><Pagination
//                         align='center'
//                         onChange={handlePageChange}
//                         current={currentPage}
//                         total={pagesCount * 6}
//                         pageSize={6}
//                         style={{ textAlign: 'center', marginBottom: '1rem' }}
//                     />
//                 </ConfigProvider>
//             }

//             <DeleteReviewModal
//                 isReviewApproved={selectedReview?.isApproved}
//                 reviewId={selectedReview?.id}
//                 reviewUserId={selectedReview?.userId}
//                 setVisible={setIsDeleteModalVisible}
//                 visible={isDeleteModalVisible}
//             />

//             <Modal
//                 open={isModalOpen}
//                 onCancel={handleCloseModal}
//                 footer={null}
//                 title={selectedReview ? `${selectedReview.userName}'s Review` : ''}
//                 style={{ top: 30 }}
//             >
//                 {selectedReview && (
//                     <>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>

//                             <Avatar
//                                 src={selectedReview.profileImageUrl || undefined}
//                                 size={40}
//                                 icon={!selectedReview.profileImageUrl && <UserOutlined />}
//                             />

//                             <Rate disabled value={selectedReview.rating} />
//                         </div>

//                         {selectedReview?.imagesUrls?.length > 0 && (
//                             <Card
//                                 title={<span><PictureOutlined style={{ marginRight: 8 }} />Images</span>}
//                                 size="small"
//                                 style={{
//                                     marginTop: '1.5rem',
//                                     backgroundColor: '#f6ffed',
//                                     border: '1px solid #b7eb8f',
//                                     borderRadius: '10px',
//                                     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
//                                 }}
//                                 styles={{
//                                     header: {
//                                         backgroundColor: '#e6fffb', fontWeight: 'bold'
//                                     }
//                                 }}
//                             >
//                                 <Image.PreviewGroup>
//                                     <div style={{
//                                         display: 'flex',
//                                         gap: '10px',
//                                         flexWrap: 'wrap',
//                                         justifyContent: 'flex-start'
//                                     }}
//                                     >
//                                         {selectedReview.imagesUrls.map((url, index) => (
//                                             <Image
//                                                 key={index}
//                                                 src={url}
//                                                 width={100}
//                                                 height={100}
//                                                 style={{
//                                                     objectFit: 'cover',
//                                                     borderRadius: '8px',
//                                                     cursor: 'pointer',
//                                                     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
//                                                     transition: 'transform 0.2s ease-in-out',
//                                                 }}
//                                                 preview
//                                             />
//                                         ))}
//                                     </div>
//                                 </Image.PreviewGroup>
//                             </Card>
//                         )}

//                         <Typography.Paragraph style={{ textAlign: 'justify', marginTop: '1rem' }}>
//                             {selectedReview.content}
//                         </Typography.Paragraph>
//                     </>
//                 )}
//             </Modal>
//         </>
//     )
// };

// export default MyReviews;

import ReviewsSection from "../ReviewsSection";

const MyReviews = () => {
    return <ReviewsSection isForAdmin={false} isForPlace={false} isForUser={true} />
};

export default MyReviews;