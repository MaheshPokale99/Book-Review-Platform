import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { BookOpenIcon, HomeIcon, UserIcon, ArrowRightOnRectangleIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Navbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpenIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">BookReview</span>
          </Link>

          <div className="flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-primary-600 flex items-center space-x-1">
                <HomeIcon className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link to="/books" className="text-gray-600 hover:text-primary-600 flex items-center space-x-1">
                <BookOpenIcon className="h-5 w-5" />
                <span>Books</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="text-gray-600 hover:text-primary-600 flex items-center space-x-1">
                    <UserIcon className="h-5 w-5" />
                    <span>{user?.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-primary-600 flex items-center space-x-1"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-primary-600">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
            <button
              onClick={onToggleSidebar}
              className="md:hidden text-gray-600 hover:text-primary-600"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 