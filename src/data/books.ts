import { fetchBooks } from "../api/bookApi";
export interface Book {
  id: number | string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  genre?: string;
  reviews: Review[];
}

export interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

export const initialBooks: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverUrl: "https://source.unsplash.com/random/400x600?book,1",
    description:
      "A story of wealth, love, and the American Dream in the 1920s.",
    genre: "Classics",
    reviews: [],
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverUrl: "https://source.unsplash.com/random/400x600?book,2",
    description:
      "A novel about racial injustice and moral growth in the American South.",
    genre: "Fiction",
    reviews: [],
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    coverUrl: "https://source.unsplash.com/random/400x600?book,3",
    description: "A dystopian novel about totalitarianism and surveillance.",
    genre: "Science Fiction",
    reviews: [],
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    coverUrl: "https://source.unsplash.com/random/400x600?book,4",
    description:
      "A romantic novel of manners set in early 19th-century England.",
    genre: "Romance",
    reviews: [],
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    coverUrl: "https://source.unsplash.com/random/400x600?book,5",
    description: "A classic novel about teenage angst and alienation.",
    genre: "Classics",
    reviews: [],
  },
  {
    id: 6,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    coverUrl: "https://source.unsplash.com/random/400x600?book,6",
    description: "A fantasy novel about the adventures of a hobbit.",
    genre: "Fantasy",
    reviews: [],
  },
];

export const getBooks = async (): Promise<Book[]> => {
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    return JSON.parse(storedBooks);
  }

  try {
    // Fetch from API if not in local storage
    const apiBooks = await fetchBooks();

    if (apiBooks.length > 0) {
      localStorage.setItem("books", JSON.stringify(apiBooks));
      return apiBooks;
    }
  } catch (error) {
    console.error("Error fetching books:", error);
  }

  localStorage.setItem("books", JSON.stringify(initialBooks));
  return initialBooks;
};

export const getBook = async (id: number): Promise<Book | undefined> => {
  const books = await getBooks();
  return books.find((book) => book.id === id);
};

export const addReview = async (
  bookId: number,
  review: Omit<Review, "id" | "date">
): Promise<void> => {
  const books = await getBooks();
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    const newReview: Review = {
      ...review,
      id: Date.now(),
      date: new Date().toISOString(),
    };

    books[bookIndex].reviews.push(newReview);
    localStorage.setItem("books", JSON.stringify(books));
  }
};
