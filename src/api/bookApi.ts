import axios from "axios";
import { type Book } from "../data/books";

// Interface for Google Books API response
interface GoogleBooksResponse {
  items: {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      categories?: string[];
      imageLinks?: {
        thumbnail?: string;
      };
      averageRating?: number;
    };
  }[];
}

// Function to map Google Books response to our Book interface
// Update your mapGoogleBooksToBooks function like this:

const mapGoogleBooksToBooks = (
  response: GoogleBooksResponse,
  category: string
): Book[] => {
  if (!response.items) return [];
  // @ts-ignore
  return response.items.map((item, index) => {
    // Check if there's a valid thumbnail image
    const hasThumbnail = item.volumeInfo.imageLinks?.thumbnail ? true : false;

    return {
      id: `${category}-${index}`, // Create string ID combining category and index
      title: item.volumeInfo.title || "Unknown Title",
      author: item.volumeInfo.authors?.[0] || "Unknown Author",
      // Use a consistent fallback image if no thumbnail is available
      coverUrl: hasThumbnail
        ? item.volumeInfo.imageLinks!.thumbnail!.replace("http:", "https:")
        : "/assets/book-cover-placeholder.jpg", // Path to your fallback image
      description: item.volumeInfo.description || "No description available.",
      genre: category, // Use our category as the genre
      reviews: [], // No reviews initially
    };
  });
};

// Categories we want to fetch
export const categories = [
  "Mystery",
  "Horror",
  "Autobiography",
  "Romance",
  "Science Fiction",
];

// Fetch books for a specific category
export const fetchBooksByCategory = async (
  category: string
): Promise<Book[]> => {
  try {
    const response = await axios.get<GoogleBooksResponse>(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=20`
    );

    return mapGoogleBooksToBooks(response.data, category);
  } catch (error) {
    console.error(`Error fetching ${category} books:`, error);
    return [];
  }
};

// Fetch books from all categories
export const fetchAllCategoryBooks = async (): Promise<
  Record<string, Book[]>
> => {
  const categoryBooks: Record<string, Book[]> = {};

  // Use Promise.all to fetch all categories in parallel
  await Promise.all(
    categories.map(async (category) => {
      categoryBooks[category] = await fetchBooksByCategory(category);
    })
  );

  return categoryBooks;
};

// For backwards compatibility
export const fetchBooks = async (): Promise<Book[]> => {
  const allBooks = await fetchAllCategoryBooks();
  // Flatten all books into a single array
  return Object.values(allBooks).flat();
};

// Add this new function to fetch a book by its ID
export const fetchBookById = async (id: string): Promise<Book | null> => {
  try {
    // First check if the book is in localStorage
    const storedBooksJSON = localStorage.getItem("books");
    if (storedBooksJSON) {
      const allBooks: Book[] = JSON.parse(storedBooksJSON);
      // @ts-ignore
      const bookById = allBooks.find((book) => book.id === id);
      if (bookById) return bookById;
    }

    // If not found in localStorage, fetch from the API
    // We need to determine which category to check based on the ID format
    const allCategoryBooks = await fetchAllCategoryBooks();

    // Search through all categories to find the book
    for (const books of Object.values(allCategoryBooks)) {
      // @ts-ignore
      const book = books.find((book) => book.id === id);
      if (book) return book;
    }

    // If still not found, return null
    return null;
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return null;
  }
};

// Test function to log the fetched data
export const testFetchBooks = async (): Promise<void> => {
  try {
    console.log("Fetching books from Google Books API...");
    const books = await fetchBooks();
    console.log("Fetched books:", books);
  } catch (error) {
    console.error("Error in test fetch:", error);
  }
};

// Update addReview to work with string IDs
export const addReview = async (
  bookId: string,
  review: { username: string; rating: number; comment: string }
): Promise<void> => {
  try {
    // Get the current state of books
    const storedBooksJSON = localStorage.getItem("books");
    if (!storedBooksJSON) throw new Error("No books found in storage");

    const allBooks: Book[] = JSON.parse(storedBooksJSON);
    // @ts-ignore
    const bookIndex = allBooks.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) throw new Error("Book not found");

    // Create the new review
    // @ts-ignore
    const newReview: Review = {
      id: Date.now(),
      username: review.username,
      rating: review.rating,
      comment: review.comment,
      date: new Date().toISOString(),
    };

    // Add the review to the book
    allBooks[bookIndex].reviews.push(newReview);

    // Save updated books back to localStorage
    localStorage.setItem("books", JSON.stringify(allBooks));
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};
