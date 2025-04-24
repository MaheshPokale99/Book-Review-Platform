const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getReviews,
    createReview,
    refineReview,
    updateReview,
    deleteReview,
} = require('../controllers/reviewsController');


// Public Routes
router.get('/', getReviews);

// Protected Routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/refine', protect, refineReview);

module.exports = router;
