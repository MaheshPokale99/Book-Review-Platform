# Book Review Platform

A full-stack web application for reviewing and discovering books. Built with MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User Authentication (Register, Login, Logout)
- Book Management (Add, View, Search, Filter by Genre)
- Review System (Create, Read, Update, Delete)
- AI-Powered Review Refinement
- User Profiles with Bio and Profile Picture
- Admin Dashboard
- Responsive Design
- Rating System (1-5 stars)
- Book Details with Reviews
- Genre-based Book Filtering

## Tech Stack

### Frontend
- React.js (Vite)
- Redux Toolkit (State Management)
- React Router v6 (Routing)
- Tailwind CSS (Styling)
- Axios (HTTP Client)
- React Hot Toast (Notifications)
- Heroicons (Icons)

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- JWT (Authentication)
- Bcrypt (Password Hashing)
- OpenAI API (Review Refinement)

## Data Models

### User
```javascript
{
  username: String,
  email: String,
  password: String,
  profilePicture: String,
  bio: String,
  isAdmin: Boolean,
  timestamps: true
}
```

### Book
```javascript
{
  title: String,
  author: String,
  description: String,
  coverImage: String,
  isbn: String,
  genre: [String],
  publishedDate: Date,
  averageRating: Number,
  totalReviews: Number,
  timestamps: true
}
```

### Review
```javascript
{
  bookId: ObjectId,
  userId: ObjectId,
  rating: Number,
  originalContent: String,
  refinedContent: String,
  isRefined: Boolean,
  timestamps: true
}
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- `GET /api/auth/me` - Get current user profile (Protected)

### Books

- `GET /api/books` - Get all books
  Query Parameters:
  - page (default: 1)
  - limit (default: 10)
  - search (optional)
  - genre (optional)

- `GET /api/books/:id` - Get book by ID

- `POST /api/books` - Create new book (Protected, Admin only)
  ```json
  {
    "title": "string",
    "author": "string",
    "description": "string",
    "coverImage": "string",
    "isbn": "string",
    "genre": ["string"],
    "publishedDate": "date"
  }
  ```

### Reviews

- `GET /api/reviews` - Get reviews for a book
  Query Parameters:
  - bookId (required)
  - page (default: 1)
  - limit (default: 10)

- `POST /api/reviews` - Create new review (Protected)
  ```json
  {
    "bookId": "string",
    "rating": "number",
    "content": "string"
  }
  ```

- `PUT /api/reviews/:id` - Update review (Protected)
  ```json
  {
    "rating": "number",
    "content": "string"
  }
  ```

- `DELETE /api/reviews/:id` - Delete review (Protected)

- `POST /api/reviews/:id/refine` - Refine review using AI (Protected)

### Users

- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
  ```json
  {
    "username": "string",
    "email": "string",
    "profilePicture": "string",
    "bio": "string"
  }
  ```

## Frontend Routes

- `/` - Home page
- `/books` - Book listing with search and filters
- `/books/:id` - Book details with reviews
- `/books/:id/review` - Write review (Protected)
- `/profile` - User profile (Protected)
- `/login` - Login page
- `/register` - Registration page

## Project Structure

```
Book-Review-Platform/
├── backend/
│   ├── config/
│   │   └── config.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── userRoutes.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── ui/
│   │   │   └── books/
│   │   ├── pages/
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   └── index.js
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Features in Detail

### Authentication
- JWT-based authentication with refresh tokens
- Password hashing using bcrypt
- Protected routes with role-based access
- User session management
- Profile management

### Book Management
- CRUD operations for books
- Search functionality with multiple filters
- Genre-based filtering
- Pagination with customizable limits
- ISBN validation
- Average rating calculation

### Review System
- Star rating system (1-5)
- Text reviews with AI refinement
- One review per user per book
- Review editing and deletion
- Review pagination
- Average rating calculation

### User Experience
- Responsive design with mobile-first approach
- Loading states with skeleton loaders
- Error handling with toast notifications
- Form validation
- Image upload support
- Dark mode support

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookreview
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Book-Review-Platform
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create environment files and set up variables

5. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```