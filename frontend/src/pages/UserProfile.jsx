import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../store/slices/authSlice';
import { fetchReviews } from '../store/slices/reviewSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector((state) => state.auth);
  const { reviews, loading: reviewsLoading } = useSelector((state) => state.reviews);

  // Fetch user data only once when component mounts
  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  // Fetch reviews only when user is available
  useEffect(() => {
    if (user?._id && !reviewsLoading) {
      dispatch(fetchReviews({ userId: user._id }));
    }
  }, [dispatch, user?._id]);

  if (userLoading) {
    return (
      <div className="space-y-8">
        <div className="card">
          <Skeleton height={100} className="mb-4" />
          <Skeleton height={24} width="40%" className="mb-2" />
          <Skeleton height={20} width="60%" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Please log in to view your profile
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Info */}
      <div className="card">
        <div className="flex items-center space-x-6">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-600">
                {user.username?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-600">{user.email}</p>
            {user.bio && (
              <p className="text-gray-700 mt-2">{user.bio}</p>
            )}
            <p className="text-gray-600 mt-2">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
            {user.isAdmin && (
              <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* User's Reviews */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Reviews</h2>
        {reviewsLoading ? (
          // Loading skeletons for reviews
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="card mb-4">
                <Skeleton height={24} width="40%" className="mb-2" />
                <Skeleton height={20} width="20%" className="mb-4" />
                <Skeleton count={3} />
              </div>
            ))
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="card mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {review.book?.title || 'Unknown Book'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.originalContent}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">You haven't written any reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 