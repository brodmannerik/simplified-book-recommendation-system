# Book.com - Your Online Bookshelf

## Overview

Book.com is a modern web application that allows users to browse, search, and review books across multiple genres. It features a Netflix-style UI with horizontally scrollable rows categorized by genre and dynamic search functionality. The application integrates with the Google Books API to provide a rich database of books while maintaining a clean, user-friendly interface.

## Architecture

![Book.com Architecture](/images/diagram.jpg)

The diagram above illustrates the component structure of Book.com, showing how the different parts of the application interact with each other.

## Features

- User Authentication
  - Login system with username/password authentication
  - "Remember Me" functionality using localStorage/sessionStorage
    Protected routes require authentication
    Responsive user profile display in header
- Book Discovery
  - Netflix-style UI with books organized by genre
  - Horizontal scrolling rows with navigation buttons
  - Dynamic search across titles and authors
  - Book cover images from Google Books API
  - Fallback to random book covers when API images unavailable
- Book Details
  - Detailed view of each book with description
  - User reviews and ratings
  - Ability to add new reviews when logged in
- Responsive Design
  - Mobile-friendly interface
  - Adaptive layout for different screen sizes
  - Optimized header for mobile viewing

## Tech Stack

- React 19 with TypeScript
- React Router for navigation
- Ant Design component library
- Styled Components for custom styling
- Axios for API requests
- Jest and React Testing - Library for testing

## Setup and Installation

1. Clone the repository

```bash
git clone
```

2. Install dependencies

```bash
npm install
```

3. Run development server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

5. Run tests

```bash
npm test
```

## Usage

1. Login

- Use any username and password to log in
- Toggle "Remember Me" to stay logged in across browser sessions

2. Browse Books

- Scroll horizontally through genre categories
- Use the arrow buttons to navigate through books in each category
- Click on a book to view details

3. Search Books

- Use the search bar to find books by title or author
- Results update dynamically as you type

4. View and Add Reviews

- On the book details page, view existing reviews
- Add your own review with a rating and comment

## Additional Features and Improvements

1. Authentication Enhancements
   - Session persistence with "Remember Me" option
   - User initials displayed in avatar
   - Automatic redirection based on authentication state
   - Comprehensive authentication tests
2. Google Books API Integration
   - Dynamic fetching of books by genre category
   - Parallel API requests for multiple categories
   - Error handling and loading states
   - Local storage caching of book data
3. UI/UX Improvements
   - Custom styling for Ant Design components
   - Consistent color scheme with grey accent
   - Animated hover effects on book cards
   - Custom Google Font integration (Poppins)
   - Responsive layout adjustments for mobile
4. Performance Optimizations
   - Efficient state management
   - Horizontal virtualization for book rows
   - Lazy loading of book images
   - Debounced search functionality
