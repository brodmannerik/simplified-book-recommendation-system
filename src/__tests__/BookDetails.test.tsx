import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import BookDetails from "../pages/BookDetails";
import { AuthProvider } from "../context/AuthContext";
import ratingsReducer from "../store/ratingsSlice";

// Mock the API
jest.mock("../api/bookApi", () => ({
  fetchBookById: jest.fn(() =>
    Promise.resolve({
      id: "123",
      title: "Test Book",
      author: "Test Author",
      description: "Test description",
      genre: "Fiction",
      coverUrl: "https://example.com/cover.jpg",
      reviews: [],
    })
  ),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "123" }),
  useNavigate: () => mockNavigate,
}));

// Create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      ratings: ratingsReducer,
    },
    preloadedState: initialState,
  });
};

// Create a wrapper component for testing
const TestWrapper = ({
  children,
  isLoggedIn = false,
  store = createTestStore(),
}) => {
  // Mock the auth context
  const mockAuthContext = {
    isLoggedIn,
    username: isLoggedIn ? "testuser" : "",
    login: jest.fn(),
    logout: jest.fn(),
    rememberMe: false,
    setRememberMe: jest.fn(),
  };

  jest
    .spyOn(require("../context/AuthContext"), "useAuth")
    .mockImplementation(() => mockAuthContext);

  return (
    <Provider store={store}>
      <AuthProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </AuthProvider>
    </Provider>
  );
};

describe("BookDetails Component", () => {
  test("displays book cover image", async () => {
    render(
      <TestWrapper isLoggedIn={true}>
        <BookDetails />
      </TestWrapper>
    );

    // Wait for the book to load
    await waitFor(() => {
      const coverImage = screen.getByAltText("Test Book");
      expect(coverImage).toBeInTheDocument();
      expect(coverImage).toHaveAttribute(
        "src",
        "https://example.com/cover.jpg"
      );
    });
  });

  test("displays book information correctly", async () => {
    render(
      <TestWrapper isLoggedIn={true}>
        <BookDetails />
      </TestWrapper>
    );

    // Check for book details
    await waitFor(() => {
      expect(screen.getByText("Test Book")).toBeInTheDocument();
      expect(screen.getByText("by Test Author")).toBeInTheDocument();
      expect(screen.getByText("Test description")).toBeInTheDocument();
      expect(screen.getByText("Fiction")).toBeInTheDocument();
    });
  });

  test("shows review form only for logged in users", async () => {
    // First test with logged out user
    const { unmount } = render(
      <TestWrapper isLoggedIn={false}>
        <BookDetails />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByText("Your Rating")).not.toBeInTheDocument();
      expect(screen.queryByText("Your Review")).not.toBeInTheDocument();
    });

    // Unmount and test with logged in user
    unmount();
    render(
      <TestWrapper isLoggedIn={true}>
        <BookDetails />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Your Rating")).toBeInTheDocument();
      expect(screen.getByText("Your Review")).toBeInTheDocument();
    });
  });

  test("allows submitting a review when logged in", async () => {
    const store = createTestStore();

    render(
      <TestWrapper isLoggedIn={true} store={store}>
        <BookDetails />
      </TestWrapper>
    );

    // Wait for component to load
    await waitFor(() => screen.getByText("Your Review"));

    // Fill in review form
    const ratingStars = screen.getAllByRole("radio");
    fireEvent.click(ratingStars[4]); // Select 5 stars

    const commentInput = screen.getByPlaceholderText(
      "Share your thoughts about this book..."
    );
    fireEvent.change(commentInput, { target: { value: "Great book!" } });

    // Submit the review
    const submitButton = screen.getByText("Submit Review");
    fireEvent.click(submitButton);

    // Check if review appears in the list
    await waitFor(() => {
      expect(screen.getByText("testuser")).toBeInTheDocument();
      expect(screen.getByText("Great book!")).toBeInTheDocument();
    });
  });

  test("reviews are not persisted after store reset", async () => {
    // First add a review
    const store = createTestStore();

    const { unmount } = render(
      <TestWrapper isLoggedIn={true} store={store}>
        <BookDetails />
      </TestWrapper>
    );

    // Wait for component to load
    await waitFor(() => screen.getByText("Your Review"));

    // Fill in and submit review
    const ratingStars = screen.getAllByRole("radio");
    fireEvent.click(ratingStars[4]);

    const commentInput = screen.getByPlaceholderText(
      "Share your thoughts about this book..."
    );
    fireEvent.change(commentInput, { target: { value: "Amazing read!" } });

    fireEvent.click(screen.getByText("Submit Review"));

    // Verify review was added
    await waitFor(() => {
      expect(screen.getByText("Amazing read!")).toBeInTheDocument();
    });

    // Unmount and remount component with a new store (simulating app restart)
    unmount();
    render(
      <TestWrapper isLoggedIn={true} store={createTestStore()}>
        <BookDetails />
      </TestWrapper>
    );

    // Wait for component to load
    await waitFor(() => screen.getByText("Your Review"));

    // Check that the review is gone (as specified in requirements - no persistence)
    expect(screen.queryByText("Amazing read!")).not.toBeInTheDocument();
    expect(
      screen.getByText("No reviews yet. Be the first to review this book!")
    ).toBeInTheDocument();
  });

  test("shows 'No reviews yet' message when there are no reviews", async () => {
    render(
      <TestWrapper isLoggedIn={true}>
        <BookDetails />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(
        screen.getByText("No reviews yet. Be the first to review this book!")
      ).toBeInTheDocument();
    });
  });

  test("back button navigates to home", async () => {
    render(
      <TestWrapper isLoggedIn={true}>
        <BookDetails />
      </TestWrapper>
    );

    await waitFor(() => {
      const backButton = screen.getByText("← Back to Browse");
      fireEvent.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });
});
