import { Form, Input, Button, Card, message, Checkbox } from "antd";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 400px;
`;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = (values: {
    username: string;
    password: string;
    rememberMe: boolean;
  }) => {
    if (values.username && values.password) {
      // Call the login function from context with the rememberMe value
      login(values.username, values.password, values.rememberMe);
      message.success("Successfully logged in!");
      navigate("/home");
    }
  };

  return (
    <>
      <LoginContainer>
        <StyledCard title="Login to Book.com">
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ rememberMe: false }}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item name="rememberMe" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </StyledCard>
      </LoginContainer>
    </>
  );
}

export default Login;
