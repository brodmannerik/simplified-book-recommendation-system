import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => void;
  logout: () => void;
  username: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Check for existing user in localStorage on component mount
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) {
      setIsLoggedIn(true);
      setUsername(storedUser);
    }
  }, []);

  const login = (username: string, password: string, rememberMe = false) => {
    // Choose storage based on rememberMe option
    const storage = rememberMe ? localStorage : sessionStorage;

    // Store user data in the selected storage
    storage.setItem("user", username);

    // Store initials for avatar display
    const initials = username
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase();
    storage.setItem("userInitials", initials);

    setIsLoggedIn(true);
    setUsername(username);
  };

  const logout = () => {
    // Clear both storage types to ensure complete logout
    localStorage.removeItem("user");
    localStorage.removeItem("userInitials");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userInitials");

    setIsLoggedIn(false);
    setUsername(null);
  };

  return (
    <>
      <AuthContext.Provider value={{ isLoggedIn, login, logout, username }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
