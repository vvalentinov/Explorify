import { useNavigate } from 'react-router-dom';

import { fireError } from '../../../utils/fireError';

import { useState, useContext } from 'react';

import { AuthContext } from '../../../contexts/AuthContext';

import DeleteReviewModal from '../Modals/DeleteReviewModal';

import { reviewsServiceFactory } from '../../../services/reviewsService';

import { motion } from 'framer-motion';

import ReviewCard from '../ReviewCard/ReviewCard';

import OpenReviewModal from '../Modals/OpenReviewModal';

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
        reviewsService
            .revertReview(reviewId)
            .then(res => {
                navigate('/', { state: { successOperation: { message: res.successMessage } } })
            }).catch(err => {
                fireError(err);
            });
    }

    return (
        <>
            <section style={{ display: 'flex', justifyContent: 'center' }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        justifyContent: 'center',
                        border: 'solid 1px black',
                        overflowX: 'hidden',
                        minHeight: 'calc(100vh - 100px)',
                        width: '100%',
                    }}
                >
                    {reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            variants={cardVariants}
                            style={{
                                flexBasis: '32%',
                            }}
                        >
                            <ReviewCard
                                handleDelete={handleDelete}
                                handleOpenModal={handleOpenModal}
                                handleRevert={handleRevert}
                                isForPlace={false}
                                review={review}
                                isForUser={true}
                                isForAdmin={false}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </section>


            <DeleteReviewModal
                reviewId={selectedReview?.id}
                isReviewApproved={selectedReview?.isApproved}
                reviewUserId={selectedReview?.userId}
                setVisible={setIsDeletedModalOpen}
                visible={isDeletedModalOpen}
            />

            <OpenReviewModal
                handleCloseModal={handleCloseModal}
                isModalOpen={isModalOpen}
                selectedReview={selectedReview}
                isForAdmin={false}
                isForUser={true}
            />

        </>
    );
};

export default MyReviewsList;