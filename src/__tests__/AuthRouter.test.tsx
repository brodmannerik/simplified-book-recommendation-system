import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { AuthProvider } from "../context/AuthContext";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { Provider } from "react-redux";
import { store } from "../store/store";

// Mock the book data service to prevent issues with localStorage
jest.mock("../data/books", () => ({
  getBooks: jest.fn(() => []),
  getBook: jest.fn(),
  addReview: jest.fn(),
}));

// Mock Google Books API call
jest.mock("../api/bookApi", () => ({
  fetchAllCategoryBooks: jest.fn(() => Promise.resolve({})),
  fetchBookById: jest.fn(() => Promise.resolve({})),
  categories: [],
}));

// Setup app with routes for testing
const AppWithRoutes = ({ initialRoute = "/" }) => (
  <Provider store={store}>
    <AuthProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Login />} />
            <Route path="home" element={<Home />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  </Provider>
);

describe("Auth Router", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test("redirects to login when accessing protected route without auth", async () => {
    render(<AppWithRoutes initialRoute="/home" />);

    // Should show login form instead of home page
    expect(await screen.findByText(/login to bookreview/i)).toBeInTheDocument();
    expect(screen.queryByText(/browse books/i)).not.toBeInTheDocument();
  });

  test("allows access to protected route when authenticated", async () => {
    // Simulate authenticated user
    localStorage.setItem("user", "testuser");

    render(<AppWithRoutes initialRoute="/home" />);

    // Should show home page
    expect(await screen.findByText(/browse books/i)).toBeInTheDocument();
    expect(screen.queryByText(/login to bookreview/i)).not.toBeInTheDocument();
  });

  test("redirects to home when authenticated user tries to access login page", async () => {
    // Simulate authenticated user
    localStorage.setItem("user", "testuser");

    render(<AppWithRoutes initialRoute="/" />);

    // Should redirect to home instead of showing login
    expect(await screen.findByText(/browse books/i)).toBeInTheDocument();
    expect(screen.queryByText(/login to bookreview/i)).not.toBeInTheDocument();
  });

  test("does not automatically log in when no credentials are stored", async () => {
    render(<AppWithRoutes />);

    // Should show login page
    expect(await screen.findByText(/login to bookreview/i)).toBeInTheDocument();
  });
});
