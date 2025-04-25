import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../store/slices/reviewSlice';
import { fetchBookById } from '../store/slices/bookSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBook: book, loading: bookLoading } = useSelector((state) => state.books);
  const { loading: reviewLoading, error } = useSelector((state) => state.reviews);

  const [formData, setFormData] = useState({
    rating: 5,
    content: '',
  });

  useEffect(() => {
    dispatch(fetchBookById(id));
  }, [dispatch, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createReview({ bookId: id, ...formData })).unwrap();
      navigate(`/books/${id}`);
    } catch (error) {
      // Error handling is done by the Alert component
      console.error('Failed to create review:', error);
    }
  };

  if (bookLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <Skeleton height={32} width="60%" className="mb-6" />
          <Skeleton height={32} width="40%" className="mb-4" />
          <Skeleton height={200} className="mb-6" />
          <Skeleton height={40} width="30%" />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h2>
        <button
          onClick={() => navigate('/books')}
          className="btn btn-primary"
        >
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Write a Review for {book.title}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Review Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Review
            </label>
            <textarea
              id="content"
              rows={6}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="input"
              placeholder="Share your thoughts about this book..."
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/books/${id}`)}
              className="btn btn-secondary"
              disabled={reviewLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={reviewLoading}
              className="btn btn-primary"
            >
              {reviewLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm; 