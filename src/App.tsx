import styled from "styled-components";
import { Layout } from "antd";
import Header from "./Components/Header";
import { Outlet, Navigate, useLocation } from "react-router";
import { useAuth } from "./context/AuthContext";

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
`;

function App() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  // Check if the route is protected (anything but the login page)
  const isProtectedRoute = location.pathname !== "/";

  return (
    <>
      <StyledLayout>
        <Header />
        <StyledContent>
          {isProtectedRoute && !isLoggedIn ? (
            // Redirect to login if trying to access protected route while not logged in
            <Navigate to="/" replace />
          ) : location.pathname === "/" && isLoggedIn ? (
            // Redirect to home if already logged in and trying to access login page
            <Navigate to="/home" replace />
          ) : (
            <Outlet />
          )}
        </StyledContent>
      </StyledLayout>
    </>
  );
}

export default App;
