import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Rating, Box, IconButton, Menu, MenuItem } from '@mui/material';
import StarRateIcon from '@mui/icons-material/StarRate';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import conf from '../../conf/conf';
import { useSelector } from 'react-redux';
import { getUserData } from '../../utils/userFunctions';

const ReviewComponent = ({ prodId }) => {
    const token = useSelector(state => state.auth.token);

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            rating: 4
        }
    });

    const [reviews, setReviews] = useState([]);
    const [reviewerName, setReviewerName] = useState(null);
    const [avgRating, setAvgRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReviews = async (page) => {
        try {
            const { data } = await axios.get(`${conf.baseUrl}/products/${prodId}/reviews`, { params: { page } });
            setReviews(data.reviews);
            setCurrentPage(page);
            setTotalPages(data.totalPages);
            setAvgRating(data.avgRating);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchReviews(currentPage);
    }, [currentPage]);

    useEffect(() => {
        getUserData()
            .then((response) => setReviewerName(response.userData.username))
            .catch((err) => {
                setReviewerName(null);
                console.log(err);
            });
    }, [token]);

    const onSubmit = async (data) => {
        const { reviewBody, rating } = data;
        const review = { body: reviewBody, rating: rating || 4, reviewer: reviewerName };
        if (review.reviewer !== null) {
            try {
                const response = await axios.post(`${conf.baseUrl}/products/${prodId}/reviews`, review);
                fetchReviews(1);
                setAvgRating(response.data.avgRating);
                reset();
            } catch (error) {
                console.error('Error saving review:', error);
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDeleteReview = async (review) => {
        try {
            const response = await axios.delete(`${conf.baseUrl}/products/${prodId}/reviews`, { data: { review, prodId }, withCredentials: true });
            fetchReviews(currentPage);
            setAvgRating(response.data.avgRating)

        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    return (
        <div className="px-4 mt-5" style={{ maxWidth: '100%' }}>
            {token && <h2 className="mb-4" style={{ color: '#111', fontWeight: 'bold' }}>Customer Reviews</h2>}

            {token && <div className="card p-4 mb-4 w-100" style={{ backgroundColor: '#fff', borderColor: '#ddd', maxWidth: '100%' }}>
                <h4 className="mb-3" style={{ color: '#333', fontWeight: 'bold' }}>Write a Review</h4>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-group mb-3">
                        <label htmlFor="reviewBody" className="form-label" style={{ fontWeight: 'bold' }}>Your Review</label>
                        <TextField
                            {...register('reviewBody', { required: 'Review is required' })}
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            placeholder="Share your thoughts on the product"
                            sx={{ '& .MuiOutlinedInput-root': { color: '#333', borderColor: '#ddd' } }}
                            error={!!errors.reviewBody}
                            helperText={errors.reviewBody ? errors.reviewBody.message : ''}
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="rating" className="form-label" style={{ fontWeight: 'bold' }}>Rating</label>
                        <Controller
                            name="rating"
                            control={control}
                            rules={{
                                required: 'Rating is required',
                                min: { value: 1, message: 'Minimum rating is 1' },
                                max: { value: 5, message: 'Maximum rating is 5' }
                            }}
                            render={({ field }) => (
                                <Box>
                                    <Rating
                                        {...field}
                                        value={Number(field.value)}
                                        onChange={(event, newValue) => field.onChange(newValue)}
                                        precision={0.5}
                                        sx={{ color: '#FF9900' }} // Amazon orange for stars
                                    />
                                    {errors.rating && (
                                        <p className="text-danger">{errors.rating.message}</p>
                                    )}
                                </Box>
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: '#FF9900', // Amazon button orange
                            color: '#fff',
                            '&:hover': { backgroundColor: '#F08804' }
                        }}
                        className="mt-3 w-100"
                    >
                        Submit Review
                    </Button>
                </form>
            </div>}

            {/* Display Reviews */}
            <div className="mt-5">
                <h4 className="mb-4" style={{ color: '#111', fontWeight: 'bold' }}>All Reviews {avgRating ? avgRating : "No Ratings"} {reviews.length ? <StarRateIcon /> : ""}</h4>
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div
                            key={index}
                            className="card p-4 mb-3 shadow-sm w-100"
                            style={{ borderColor: '#ddd', maxWidth: '100%' }}
                        >
                            {/* Flexbox for top row: Username and Menu */}
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <h5 className="mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
                                    {review.reviewer}
                                </h5>

                                {/* Menu for actions */}
                                {reviewerName === review.reviewer && (
                                    <div className="dropdown">
                                        <button
                                            className="btn rounded"
                                            type="button"
                                            id={`dropdownMenuButton-${index}`}
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="material-icons"><MoreVertIcon /></i>
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${index}`}>
                                            <li>
                                                <button className="dropdown-item" onClick={() => handleDeleteReview(review)}>
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Stars rating positioned below username and above body */}
                            <div className="mb-2">
                                <Rating
                                    value={Number(review.rating)}
                                    precision={0.5}
                                    readOnly
                                    sx={{ color: '#FF9900' }} // Amazon orange for stars
                                />
                            </div>

                            {/* Review Body */}
                            <p className="mb-1" style={{ color: '#555' }}>{review.body}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet. Be the first to write a review!</p>
                )}


            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="contained"
                        sx={{
                            backgroundColor: '#FF9900',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#F08804' }
                        }}
                    >
                        Previous
                    </Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        variant="contained"
                        sx={{
                            backgroundColor: '#FF9900',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#F08804' }
                        }}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ReviewComponent;
