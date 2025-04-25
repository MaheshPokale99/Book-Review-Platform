import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import store from './store';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import ReviewForm from './pages/ReviewForm';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/routing/PrivateRoute';
import Alert from './components/ui/Alert';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar onToggleSidebar={toggleSidebar} />
          <div className="flex flex-1 mt-16">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="flex-grow">
              <div className="container mx-auto px-4 py-8">
                <Alert />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      theme: {
                        primary: '#4aed88',
                      },
                    },
                    error: {
                      duration: 4000,
                      theme: {
                        primary: '#ff4b4b',
                      },
                    },
                  }}
                />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/books" element={<BookList />} />
                  <Route path="/books/:id" element={<BookDetails />} />
                  <Route
                    path="/books/:id/review"
                    element={
                      <PrivateRoute>
                        <ReviewForm />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <UserProfile />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </div>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;