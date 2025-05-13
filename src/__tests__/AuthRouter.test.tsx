import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { AuthProvider } from "../context/AuthContext";
import App from "../App.tsx";
import Home from "../pages/Home.tsx";
import Login from "../pages/Login.tsx";

// Mock the book data service to prevent issues with localStorage
jest.mock("../data/books", () => ({
  getBooks: jest.fn(() => []),
  getBook: jest.fn(),
  addReview: jest.fn(),
}));

// Setup app with routes for testing
const AppWithRoutes = ({ initialRoute = "/" }) => (
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
);

describe("Auth Router", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test("redirects to login when accessing protected route without auth", () => {
    render(<AppWithRoutes initialRoute="/home" />);

    // Should show login form instead of home page
    expect(screen.getByText(/login to bookreview/i)).toBeInTheDocument();
    expect(screen.queryByText(/browse books/i)).not.toBeInTheDocument();
  });

  test("allows access to protected route when authenticated", () => {
    // Simulate authenticated user
    localStorage.setItem("user", "testuser");

    render(<AppWithRoutes initialRoute="/home" />);

    // Should show home page
    expect(screen.getByText(/browse books/i)).toBeInTheDocument();
    expect(screen.queryByText(/login to bookreview/i)).not.toBeInTheDocument();
  });

  test("redirects to home when authenticated user tries to access login page", () => {
    // Simulate authenticated user
    localStorage.setItem("user", "testuser");

    render(<AppWithRoutes initialRoute="/" />);

    // Should redirect to home instead of showing login
    expect(screen.getByText(/browse books/i)).toBeInTheDocument();
    expect(screen.queryByText(/login to bookreview/i)).not.toBeInTheDocument();
  });

  test("does not automatically log in when no credentials are stored", () => {
    render(<AppWithRoutes />);

    // Should show login page
    expect(screen.getByText(/login to bookreview/i)).toBeInTheDocument();
  });
});
