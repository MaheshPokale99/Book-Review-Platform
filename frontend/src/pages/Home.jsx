import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchFeaturedBooks } from '../store/slices/bookSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredBooks, loading } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchFeaturedBooks());
  }, [dispatch]);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-primary-50 rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Your Next Favorite Book
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Read honest reviews from fellow book lovers and share your thoughts.
        </p>
        <Link
          to="/books"
          className="btn btn-primary inline-block"
        >
          Browse Books
        </Link>
      </section>

      {/* Featured Books Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeletons
            Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="card">
                  <Skeleton height={200} className="mb-4" />
                  <Skeleton height={24} width="80%" className="mb-2" />
                  <Skeleton height={20} width="60%" />
                </div>
              ))
          ) : (
            featuredBooks.map((book) => (
              <Link
                key={book._id}
                to={`/books/${book._id}`}
                className="card hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {book.title}
                </h3>
                <p className="text-gray-600">{book.author}</p>
                <div className="mt-4 flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(book.averageRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({book.reviewCount} reviews)
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 