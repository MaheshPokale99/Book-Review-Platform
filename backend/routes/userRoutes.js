const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getUserById,
    updateUser,
    getUserReviews,
} = require('../controllers/userController');

// Public Route
router.get('/:id', getUserById);

router.put('/:id', protect, updateUser);
router.get('/:id/reviews', protect, getUserReviews);

module.exports = router;
