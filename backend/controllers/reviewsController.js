const { validationResult } = require('express-validator');
const OpenAI = require('openai');
const Review = require('../models/Review');
const Book = require('../models/Book');
const config = require('../config/config');

const openai = new OpenAI({ apiKey: config.openaiApiKey });

//error handler
const handleError = (error, res) => {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
};

// GET reviews for a book
exports.getReviews = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { bookId, page = 1, limit = 10 } = req.query;
    const total = await Review.countDocuments({ bookId });
    const reviews = await Review.find({ bookId })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
    });
  } catch (error) {
    handleError(error, res);
  }
};

//  new review
exports.createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { bookId, rating, content } = req.body;
    const userId = req.user._id;

    // Check if the user already reviewed this book
    const existingReview = await Review.findOne({ bookId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = new Review({
      bookId,
      userId,
      rating,
      originalContent: content,
    });

    await review.save();

    // Update book's average rating and total reviews
    const book = await Book.findById(bookId);
    if (book) {
      const reviews = await Review.find({ bookId });
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      book.averageRating = totalRating / reviews.length;
      book.totalReviews = reviews.length;
      await book.save();
    }

    res.status(201).json(review);
  } catch (error) {
    handleError(error, res);
  }
};

// review using AI
exports.refineReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to refine this review' });
    }

    const prompt = `Please improve the following book review while maintaining its original sentiment and key points. 
    Make it more clear, professional, and engaging:
    
    "${review.originalContent}"`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that improves book reviews while maintaining their original meaning and sentiment.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const refinedContent = completion.choices[0].message.content;
    review.refinedContent = refinedContent;
    review.isRefined = true;
    await review.save();

    res.json(review);
  } catch (error) {
    handleError(error, res);
  }
};

//update a review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const { rating, content } = req.body;
    review.rating = rating || review.rating;
    review.originalContent = content || review.originalContent;
    review.refinedContent = undefined;
    review.isRefined = false;
    await review.save();

    res.json(review);
  } catch (error) {
    handleError(error, res);
  }
};

// DELETE a review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    // Update book's average rating and total reviews
    const book = await Book.findById(review.bookId);
    if (book) {
      const reviews = await Review.find({ bookId: review.bookId });
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      book.averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      book.totalReviews = reviews.length;
      await book.save();
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    handleError(error, res);
  }
};

