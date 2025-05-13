import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import * as reactRouter from "react-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import App from "../App";
import Login from "../pages/Login";

// Mock router hooks
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: "/" }),
}));

// Test component to access auth context directly
function TestAuthConsumer() {
  const { isLoggedIn, username } = useAuth();
  return (
    <div>
      <div data-testid="loginStatus">
        {isLoggedIn ? "logged-in" : "logged-out"}
      </div>
      {username && <div data-testid="username">{username}</div>}
    </div>
  );
}

describe("Authentication", () => {
  // Clear storage before each test
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.spyOn(Storage.prototype, "setItem");
    jest.spyOn(Storage.prototype, "getItem");
  });

  test("should save user in localStorage when Remember Me is checked", async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
          <TestAuthConsumer />
        </MemoryRouter>
      </AuthProvider>
    );

    // Fill in the login form
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Check the Remember Me checkbox
    fireEvent.click(screen.getByLabelText(/remember me/i));

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    // Check if user is logged in
    expect(await screen.findByTestId("loginStatus")).toHaveTextContent(
      "logged-in"
    );

    // Check if localStorage was used
    expect(localStorage.setItem).toHaveBeenCalledWith("user", "testuser");
    expect(sessionStorage.setItem).not.toHaveBeenCalledWith("user", "testuser");
  });

  test("should save user in sessionStorage when Remember Me is not checked", async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
          <TestAuthConsumer />
        </MemoryRouter>
      </AuthProvider>
    );

    // Fill in the login form
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Do not check Remember Me (default is unchecked)

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    // Check if user is logged in
    expect(await screen.findByTestId("loginStatus")).toHaveTextContent(
      "logged-in"
    );

    // Check if sessionStorage was used
    expect(sessionStorage.setItem).toHaveBeenCalledWith("user", "testuser");
    expect(localStorage.setItem).not.toHaveBeenCalledWith("user", "testuser");
  });

  test("should automatically log in user with saved credentials in localStorage", async () => {
    // Simulate user saved in localStorage
    localStorage.setItem("user", "saveduser");

    render(
      <AuthProvider>
        <MemoryRouter>
          <TestAuthConsumer />
        </MemoryRouter>
      </AuthProvider>
    );

    // Check if user is automatically logged in
    expect(await screen.findByTestId("loginStatus")).toHaveTextContent(
      "logged-in"
    );
    expect(await screen.findByTestId("username")).toHaveTextContent(
      "saveduser"
    );
  });

  // Mock implementation for useLocation to simulate protected route
  jest.spyOn(reactRouter, "useLocation").mockImplementation(() => ({
    pathname: "/home",
    search: "",
    hash: "",
    state: null,
    key: "default",
  }));

  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/home"]}>
        <App />
      </MemoryRouter>
    </AuthProvider>
  );

  // Should render login page instead of home
  expect(screen.getByText(/login to bookreview/i)).toBeInTheDocument();
});

test("should clear all storage on logout", async () => {
  // Simulate user saved in localStorage
  localStorage.setItem("user", "saveduser");
  localStorage.setItem("userInitials", "S");

  const { rerender } = render(
    <AuthProvider>
      <MemoryRouter>
        <TestAuthConsumer />
      </MemoryRouter>
    </AuthProvider>
  );

  // Create a logout component to test
  const LogoutButton = () => {
    const { logout } = useAuth();
    return <button onClick={logout}>Logout</button>;
  };

  // Rerender with logout button
  rerender(
    <AuthProvider>
      <MemoryRouter>
        <LogoutButton />
        <TestAuthConsumer />
      </MemoryRouter>
    </AuthProvider>
  );

  // Click logout
  fireEvent.click(screen.getByText("Logout"));

  // Check if user is logged out
  expect(await screen.findByTestId("loginStatus")).toHaveTextContent(
    "logged-out"
  );

  // Check if storage was cleared
  expect(localStorage.getItem("user")).toBeNull();
  expect(localStorage.getItem("userInitials")).toBeNull();
  expect(sessionStorage.getItem("user")).toBeNull();
  expect(sessionStorage.getItem("userInitials")).toBeNull();
});
