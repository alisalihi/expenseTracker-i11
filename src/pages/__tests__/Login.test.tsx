// src/pages/__tests__/Login.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";
import { useAuth } from "../../contexts/AuthContext";

// Mock the AuthContext
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("Login", () => {
  const mockLogin = jest.fn();

  const defaultAuthState = {
    isAuthenticated: false,
    loading: false,
    user: null,
    login: mockLogin,
    signup: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(defaultAuthState);
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  describe("Rendering", () => {
    it("renders login form", () => {
      renderLogin();

      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
      expect(
        screen.getByText("Login to manage your expenses")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your email")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your password")
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });

    it("renders link to signup page", () => {
      renderLogin();

      const signupLink = screen.getByText("Sign up");
      expect(signupLink).toBeInTheDocument();
      expect(signupLink).toHaveAttribute("href", "/signup");
    });

    it("renders email and password labels", () => {
      renderLogin();

      expect(screen.getByText("Email Address")).toBeInTheDocument();
      expect(screen.getByText("Password")).toBeInTheDocument();
    });
  });

  describe("Form Input", () => {
    it("updates email input value", () => {
      renderLogin();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("updates password input value", () => {
      renderLogin();

      const passwordInput = screen.getByPlaceholderText("Enter your password");
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      expect(passwordInput).toHaveValue("password123");
    });

    it("has required attribute on email input", () => {
      renderLogin();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      expect(emailInput).toBeRequired();
    });

    it("has required attribute on password input", () => {
      renderLogin();

      const passwordInput = screen.getByPlaceholderText("Enter your password");
      expect(passwordInput).toBeRequired();
    });

    it("email input has correct type", () => {
      renderLogin();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("password input has correct type", () => {
      renderLogin();

      const passwordInput = screen.getByPlaceholderText("Enter your password");
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Form Submission", () => {
    it("calls login with form data on submit", async () => {
      mockLogin.mockResolvedValue({ success: true });
      renderLogin();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const passwordInput = screen.getByPlaceholderText("Enter your password");
      const submitButton = screen.getByRole("button", { name: "Login" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          "test@example.com",
          "password123"
        );
      });
    });

    it("navigates to home on successful login", async () => {
      mockLogin.mockResolvedValue({ success: true });
      renderLogin();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const passwordInput = screen.getByPlaceholderText("Enter your password");
      const submitButton = screen.getByRole("button", { name: "Login" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("displays error message on failed login", async () => {
      mockLogin.mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });
      renderLogin();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const passwordInput = screen.getByPlaceholderText("Enter your password");
      const submitButton = screen.getByRole("button", { name: "Login" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    it("does not navigate on failed login", async () => {
      mockLogin.mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });
      renderLogin();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const passwordInput = screen.getByPlaceholderText("Enter your password");
      const submitButton = screen.getByRole("button", { name: "Login" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("shows loading spinner during submission", async () => {
      let resolveLogin: (value: { success: boolean }) => void;
      const loginPromise = new Promise<{ success: boolean }>((resolve) => {
        resolveLogin = resolve;
      });
      mockLogin.mockReturnValue(loginPromise);

      renderLogin();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const passwordInput = screen.getByPlaceholderText("Enter your password");
      const submitButton = screen.getByRole("button", { name: "Login" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Logging in...")).toBeInTheDocument();
      });

      // Resolve the promise
      resolveLogin!({ success: true });

      await waitFor(() => {
        expect(screen.queryByText("Logging in...")).not.toBeInTheDocument();
      });
    });

    it("disables submit button during loading", async () => {
      let resolveLogin: (value: { success: boolean }) => void;
      const loginPromise = new Promise<{ success: boolean }>((resolve) => {
        resolveLogin = resolve;
      });
      mockLogin.mockReturnValue(loginPromise);

      renderLogin();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const passwordInput = screen.getByPlaceholderText("Enter your password");
      const submitButton = screen.getByRole("button", { name: "Login" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const loadingButton = screen.getByRole("button");
        expect(loadingButton).toBeDisabled();
      });

      resolveLogin!({ success: true });
    });
  });

  describe("Error Handling", () => {
    it("clears previous error on new submission", async () => {
      mockLogin
        .mockResolvedValueOnce({ success: false, error: "First error" })
        .mockResolvedValueOnce({ success: true });

      renderLogin();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const passwordInput = screen.getByPlaceholderText("Enter your password");
      const submitButton = screen.getByRole("button", { name: "Login" });

      // First submission - should fail
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("First error")).toBeInTheDocument();
      });

      // Second submission - error should be cleared initially
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText("First error")).not.toBeInTheDocument();
      });
    });

    it("displays error in styled error box", async () => {
      mockLogin.mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });
      renderLogin();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const passwordInput = screen.getByPlaceholderText("Enter your password");
      const submitButton = screen.getByRole("button", { name: "Login" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorBox = screen.getByText("Invalid credentials");
        expect(errorBox).toHaveClass("bg-red-50");
      });
    });
  });
});
