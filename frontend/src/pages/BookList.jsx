import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBooks } from '../store/slices/bookSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';

const BookList = () => {
  const dispatch = useDispatch();
  const { books, loading, pagination, error } = useSelector((state) => state.books);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch books when filters change
  useEffect(() => {
    const params = {
      page: Number(currentPage),
      limit: 10,
    };

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    if (genre) {
      params.genre = genre;
    }

    const fetchBooksPromise = dispatch(fetchBooks(params)).unwrap();
    
    toast.promise(fetchBooksPromise, {
      loading: 'Loading books...',
      success: 'Books loaded successfully',
      error: (err) => `Error loading books: ${err.message || 'Something went wrong'}`,
    });
  }, [dispatch, currentPage, debouncedSearchTerm, genre]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    toast.success('Filters applied successfully');
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(Number(newPage));
  };

  if (error) {
    toast.error(`Error loading books: ${error}`);
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading books: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input flex-grow"
            />
            <select
              value={genre}
              onChange={handleGenreChange}
              className="input"
            >
              <option value="">All Genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Mystery">Mystery</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
              <option value="Biography">Biography</option>
              <option value="History">History</option>
              <option value="Self-Help">Self-Help</option>
            </select>
            <button type="submit" className="btn btn-primary">
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeletons
          Array(8)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="card">
                <Skeleton height={200} className="mb-4" />
                <Skeleton height={24} width="80%" className="mb-2" />
                <Skeleton height={20} width="60%" />
              </div>
            ))
        ) : books.length > 0 ? (
          books.map((book) => (
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
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Published: {new Date(book.publishedDate).toLocaleDateString()}
                </p>
              </div>
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
                  ({book.totalReviews} reviews)
                </span>
              </div>
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {book.genre.map((g, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">No books found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary disabled:opacity-50"
          >
            Previous
          </button>
          <span className="flex items-center">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, pagination.totalPages))}
            disabled={currentPage === pagination.totalPages}
            className="btn btn-secondary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList; 