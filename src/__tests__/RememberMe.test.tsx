import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Login from "../pages/Login";

// Mock navigate function
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("Remember Me Functionality", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    mockNavigate.mockClear();
  });

  test("persists user data in localStorage when Remember Me is checked", () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    // Login with Remember Me checked
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByLabelText(/remember me/i));
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    // Verify data is saved in localStorage
    expect(localStorage.getItem("user")).toBe("testuser");
    expect(sessionStorage.getItem("user")).toBeNull();
  });

  test("persists user data in sessionStorage when Remember Me is not checked", () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    // Login without Remember Me
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    // Remember Me is unchecked by default
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    // Verify data is saved in sessionStorage
    expect(sessionStorage.getItem("user")).toBe("testuser");
    expect(localStorage.getItem("user")).toBeNull();
  });

  // Test component to simulate page reload/new session
  const SimulateNewSession = () => {
    const { isLoggedIn, username } = useAuth();
    return (
      <div>
        <div data-testid="sessionStatus">
          {isLoggedIn ? `Logged in as ${username}` : "Not logged in"}
        </div>
      </div>
    );
  };

  test("localStorage login survives session storage clear", () => {
    // Setup: Save user in localStorage
    localStorage.setItem("user", "persistentuser");

    // Clear sessionStorage to simulate new browser session
    sessionStorage.clear();

    render(
      <AuthProvider>
        <SimulateNewSession />
      </AuthProvider>
    );

    // User should still be logged in
    expect(screen.getByTestId("sessionStatus")).toHaveTextContent(
      "Logged in as persistentuser"
    );
  });

  test("sessionStorage login does not survive after session storage clear", () => {
    // Setup: Save user in sessionStorage only
    sessionStorage.setItem("user", "temporaryuser");

    // Clear sessionStorage to simulate new browser session
    sessionStorage.clear();

    render(
      <AuthProvider>
        <SimulateNewSession />
      </AuthProvider>
    );

    // User should not be logged in
    expect(screen.getByTestId("sessionStatus")).toHaveTextContent(
      "Not logged in"
    );
  });
});
