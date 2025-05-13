import { Layout, Button, Avatar } from "antd";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const { Header: AntHeader } = Layout;

const StyledHeader = styled(AntHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background-color: #fff;
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: bold;
  color: rgb(0, 0, 0);
  cursor: pointer;
`;

const LogoIcon = styled.img`
  height: 30px;
  width: auto;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  /* Hide on mobile */
  @media (max-width: 768px) {
    .user-greeting,
    .user-avatar {
      display: none;
    }
  }
`;

function Header() {
  const { isLoggedIn, logout, username } = useAuth();
  const navigate = useNavigate();

  // Get initials for avatar
  const getUserInitials = () => {
    if (!username) return "";

    return username
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <StyledHeader>
      <Logo onClick={() => navigate(isLoggedIn ? "/home" : "/")}>
        <LogoIcon src="/assets/icon.svg" alt="Book.com Logo" />
        Book.com
      </Logo>
      <HeaderRight>
        {isLoggedIn && (
          <UserInfo>
            <span className="user-greeting">Hello, {username}</span>
            <Avatar
              className="user-avatar"
              style={{ backgroundColor: "#1890ff" }}
            >
              {getUserInitials()}
            </Avatar>
            <Button
              type="dashed"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </UserInfo>
        )}
      </HeaderRight>
    </StyledHeader>
  );
}

export default Header;
