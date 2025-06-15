// import { useNavigate } from 'react-router-dom';

// import { fireError } from '../../../utils/fireError';

// import { useState, useContext } from 'react';

// import { AuthContext } from '../../../contexts/AuthContext';

// import DeleteReviewModal from '../Modals/DeleteReviewModal';

// import { reviewsServiceFactory } from '../../../services/reviewsService';

// import { motion } from 'framer-motion';

// import ReviewCard from '../ReviewCard/ReviewCard';

// import styles from './MyReviewsList.module.css';

// import OpenReviewModal from '../Modals/OpenReviewModal';

// const containerVariants = {
//     hidden: { opacity: 0 },
//     show: {
//         opacity: 1,
//         transition: {
//             staggerChildren: 0.1,
//         },
//     },
// };

// const cardVariants = {
//     hidden: { opacity: 0 },
//     show: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
// };


// const MyReviewsList = ({ reviews, setReviews }) => {

//     const { token } = useContext(AuthContext);

//     const navigate = useNavigate();

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedReview, setSelectedReview] = useState(null);
//     const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);

//     const reviewsService = reviewsServiceFactory(token);

//     const handleOpenModal = (review) => {
//         setSelectedReview(review);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setSelectedReview(null);
//     };

//     const handleDelete = (review) => {
//         setSelectedReview(review);
//         setIsDeletedModalOpen(true);
//     };

//     const handleRevert = (reviewId) => {
//         reviewsService
//             .revertReview(reviewId)
//             .then(res => {
//                 navigate('/', { state: { successOperation: { message: res.successMessage } } })
//             }).catch(err => {
//                 fireError(err);
//             });
//     }

//     return (
//         <>

//             <motion.div
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="show"
//                 className={styles.myReviewsListContainer}
//             >
//                 {reviews.map((review) => (
//                     <motion.div
//                         key={review.id}
//                         variants={cardVariants}
//                         className={styles.myReviewCard}
//                     >
//                         <ReviewCard
//                             handleDelete={handleDelete}
//                             handleOpenModal={handleOpenModal}
//                             handleRevert={handleRevert}
//                             isForPlace={false}
//                             review={review}
//                             isForUser={true}
//                             isForAdmin={false}
//                         />
//                     </motion.div>
//                 ))}
//             </motion.div>


//             <DeleteReviewModal
//                 reviewId={selectedReview?.id}
//                 isReviewApproved={selectedReview?.isApproved}
//                 reviewUserId={selectedReview?.userId}
//                 setVisible={setIsDeletedModalOpen}
//                 visible={isDeletedModalOpen}
//             />

//             <OpenReviewModal
//                 handleCloseModal={handleCloseModal}
//                 isModalOpen={isModalOpen}
//                 selectedReview={selectedReview}
//                 isForAdmin={false}
//                 isForUser={true}
//             />

//         </>
//     );
// };

// export default MyReviewsList;

import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { motion } from 'framer-motion';

import { AuthContext } from '../../../contexts/AuthContext';
import { reviewsServiceFactory } from '../../../services/reviewsService';
import { fireError } from '../../../utils/fireError';

import ReviewCard from '../ReviewCard/ReviewCard';
import DeleteReviewModal from '../Modals/DeleteReviewModal';
import OpenReviewModal from '../Modals/OpenReviewModal';

import styles from './MyReviewsList.module.css';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

const MyReviewsList = ({ reviews, setReviews }) => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);

    const reviewsService = reviewsServiceFactory(token);

    const handleOpenModal = (review) => {
        setSelectedReview(review);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReview(null);
    };

    const handleDelete = (review) => {
        setSelectedReview(review);
        setIsDeletedModalOpen(true);
    };

    const handleRevert = (reviewId) => {
        reviewsService.revertReview(reviewId)
            .then(res => navigate('/', { state: { successOperation: { message: res.successMessage } } }))
            .catch(err => fireError(err));
    };

    return (
        <>
            <motion.div
                className={styles.reviewsListContainer}
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {reviews.map((review) => (
                    <motion.div
                        key={review.id}
                        variants={cardVariants}
                        className={styles.reviewCardWrapper}
                    >
                        <ReviewCard
                            review={review}
                            handleOpenModal={handleOpenModal}
                            handleDelete={handleDelete}
                            handleRevert={handleRevert}
                            isForUser={true}
                            isForPlace={false}
                            isForAdmin={false}
                        />
                    </motion.div>
                ))}
            </motion.div>

            <DeleteReviewModal
                reviewId={selectedReview?.id}
                isReviewApproved={selectedReview?.isApproved}
                reviewUserId={selectedReview?.userId}
                setVisible={setIsDeletedModalOpen}
                visible={isDeletedModalOpen}
            />

            <OpenReviewModal
                selectedReview={selectedReview}
                isModalOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                isForAdmin={false}
                isForUser={true}
            />
        </>
    );
};

export default MyReviewsList;
