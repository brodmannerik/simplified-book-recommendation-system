export interface Book {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
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
    reviews: [],
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverUrl: "https://source.unsplash.com/random/400x600?book,2",
    description:
      "A novel about racial injustice and moral growth in the American South.",
    reviews: [],
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    coverUrl: "https://source.unsplash.com/random/400x600?book,3",
    description: "A dystopian novel about totalitarianism and surveillance.",
    reviews: [],
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    coverUrl: "https://source.unsplash.com/random/400x600?book,4",
    description:
      "A romantic novel of manners set in early 19th-century England.",
    reviews: [],
  },
];

export const getBooks = (): Book[] => {
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    return JSON.parse(storedBooks);
  }

  localStorage.setItem("books", JSON.stringify(initialBooks));
  return initialBooks;
};

export const getBook = (id: number): Book | undefined => {
  const books = getBooks();
  return books.find((book) => book.id === id);
};

export const addReview = (
  bookId: number,
  review: Omit<Review, "id" | "date">
): void => {
  const books = getBooks();
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
