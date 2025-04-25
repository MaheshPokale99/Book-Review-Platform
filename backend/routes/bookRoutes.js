const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    getFeaturedBooks,
} = require('../controllers/bookController');

// Public Routes
router.get('/', getBooks);
router.get('/featured', getFeaturedBooks);
router.get('/:id', getBookById);

// Admin Routes (Protected)
router.post('/', protect, isAdmin, addBook);
router.put('/:id', protect, isAdmin, updateBook);
router.delete('/:id', protect, isAdmin, deleteBook);

module.exports = router;
