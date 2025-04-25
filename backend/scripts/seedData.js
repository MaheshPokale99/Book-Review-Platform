const mongoose = require('mongoose');
const Book = require('../models/Book');
const User = require('../models/User');
const Review = require('../models/Review');
require('dotenv').config();

const sampleBooks = [
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg",
    isbn: "9780525559474",
    genre: ["Fiction", "Fantasy", "Contemporary"],
    publishedDate: "2020-08-13",
    featured: true,
    averageRating: 4.2,
    totalReviews: 0
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the Earth itself will perish.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg",
    isbn: "9780593135204",
    genre: ["Science Fiction", "Space", "Adventure"],
    publishedDate: "2021-05-04",
    featured: true,
    averageRating: 4.5,
    totalReviews: 0
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
    isbn: "9780735211292",
    genre: ["Self Help", "Nonfiction", "Psychology"],
    publishedDate: "2018-10-16",
    featured: false,
    averageRating: 4.8,
    totalReviews: 0
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg",
    isbn: "9780441172719",
    genre: ["Science Fiction", "Fantasy", "Classic"],
    publishedDate: "1965-08-01",
    featured: true,
    averageRating: 4.7,
    totalReviews: 0
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description: "Timeless lessons on wealth, greed, and happiness doing well with money isn't necessarily about what you know.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg",
    isbn: "9780857197689",
    genre: ["Finance", "Nonfiction", "Business"],
    publishedDate: "2020-09-08",
    featured: false,
    averageRating: 4.6,
    totalReviews: 0
  }
];

const sampleReviews = [
  {
    rating: 5,
    originalContent: "An absolute masterpiece! The way the author weaves complex scientific concepts with human emotion is brilliant.",
    bookId: null, // Will be set after books are created
    userId: null, // Will be set after users are created
    isRefined: false
  },
  {
    rating: 4,
    originalContent: "Really enjoyed this book. The character development was excellent and the plot kept me engaged throughout.",
    bookId: null,
    userId: null,
    isRefined: false
  }
];

const sampleUsers = [
  {
    username: "bookworm123",
    email: "bookworm@example.com",
    password: "Password123!",
    name: "Jane Reader"
  },
  {
    username: "literaryfan",
    email: "literary@example.com",
    password: "Password123!",
    name: "John Booklover"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample books
    const books = await Book.insertMany(sampleBooks);
    console.log('Sample books inserted');

    // Insert sample users
    const users = await User.insertMany(sampleUsers);
    console.log('Sample users inserted');

    // Prepare and insert sample reviews
    const reviews = sampleReviews.map((review, index) => ({
      ...review,
      bookId: books[index % books.length]._id,
      userId: users[index % users.length]._id
    }));
    await Review.insertMany(reviews);
    console.log('Sample reviews inserted');

    // Update book ratings
    for (const book of books) {
      const bookReviews = await Review.find({ bookId: book._id });
      if (bookReviews.length > 0) {
        const averageRating = bookReviews.reduce((acc, review) => acc + review.rating, 0) / bookReviews.length;
        await Book.findByIdAndUpdate(book._id, {
          averageRating,
          totalReviews: bookReviews.length
        });
      }
    }
    console.log('Book ratings updated');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase(); 