const { z } = require('zod');

const reviewSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5'),
  content: z
    .string()
    .min(10, 'Review must be at least 10 characters long')
    .max(2000, 'Review cannot exceed 2000 characters'),
});

const reviewUpdateSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5')
    .optional(),
  content: z
    .string()
    .min(10, 'Review must be at least 10 characters long')
    .max(2000, 'Review cannot exceed 2000 characters')
    .optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

exports.validateReview = (data) => {
  return reviewSchema.safeParse(data);
};

exports.validateReviewUpdate = (data) => {
  return reviewUpdateSchema.safeParse(data);
}; 