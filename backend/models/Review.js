const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  originalContent: {
    type: String,
    required: true,
    trim: true
  },
  refinedContent: {
    type: String,
    trim: true
  },
  isRefined: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// user can only review a book once
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 