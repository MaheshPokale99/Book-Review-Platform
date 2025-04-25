const { z } = require('zod');
const Book = require('../models/Book');

// Zod Schemas for validation
const createBookSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    author: z.string().min(1, 'Author is required'),
    description: z.string().min(1, 'Description is required'),
    coverImage: z.string().url('Invalid URL for cover image'),
    isbn: z.string().min(1, 'ISBN is required'),
    genre: z.array(z.string()).min(1, 'At least one genre is required'),
    publishedDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    }),
});

const queryBooksSchema = z.object({
    page: z.string().transform((val) => {
        const num = Number(val);
        if (isNaN(num)) throw new Error('Page must be a number');
        return num;
    }).refine((val) => val >= 1, {
        message: 'Page must be at least 1',
    }).optional(),
    limit: z.string().transform((val) => {
        const num = Number(val);
        if (isNaN(num)) throw new Error('Limit must be a number');
        return num;
    }).refine((val) => val >= 1 && val <= 50, {
        message: 'Limit must be between 1 and 50',
    }).optional(),
    genre: z.string().optional(),
    search: z.string().optional(),
});

// Get all books with pagination and filtering
exports.getBooks = async (req, res) => {
    try {
        const parsedQuery = queryBooksSchema.safeParse(req.query);
        if (!parsedQuery.success) {
            return res.status(400).json({
                errors: parsedQuery.error.errors.map((e) => ({
                    message: e.message,
                    path: e.path,
                })),
            });
        }

        const { page = 1, limit = 10, genre, search } = parsedQuery.data;

        const query = {};
        if (genre) query.genre = genre;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
            ];
        }

        const total = await Book.countDocuments(query);
        const books = await Book.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            books,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBooks: total,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books' });
    }
};

// Get book details by ID
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book' });
    }
};

// Add a new book (admin only)
exports.addBook = async (req, res) => {
    try {
        const parsedBody = createBookSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({
                errors: parsedBody.error.errors.map((e) => ({
                    message: e.message,
                    path: e.path,
                })),
            });
        }

        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: 'Error creating book' });
    }
};

// Update a book (admin only)
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: 'Error updating book' });
    }
};

// Delete a book (admin only)
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book' });
    }
};

// Get featured books
exports.getFeaturedBooks = async (req, res) => {
    try {
        // Get books with highest ratings and most reviews
        const featuredBooks = await Book.find()
            .sort({ 
                averageRating: -1,
                totalReviews: -1 
            })
            .limit(6); // Get top 6 featured books

        res.json(featuredBooks);
    } catch (error) {
        console.error('Error fetching featured books:', error);
        res.status(500).json({ 
            message: 'Error fetching featured books',
            error: error.message 
        });
    }
};
