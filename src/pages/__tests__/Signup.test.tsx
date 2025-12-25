// src/pages/__tests__/Signup.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Signup from "../Signup";
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

describe("Signup", () => {
  const mockSignup = jest.fn();

  const defaultAuthState = {
    isAuthenticated: false,
    loading: false,
    user: null,
    login: jest.fn(),
    signup: mockSignup,
    logout: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(defaultAuthState);
  });

  const renderSignup = () => {
    return render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
  };

  describe("Rendering", () => {
    it("renders signup form", () => {
      renderSignup();

      expect(screen.getByText("Create Account")).toBeInTheDocument();
      expect(
        screen.getByText("Sign up to start tracking your expenses")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("your.email@example.com")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Create a password (min. 6 characters)")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Confirm your password")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Sign Up" })
      ).toBeInTheDocument();
    });

    it("renders link to login page", () => {
      renderSignup();

      const loginLink = screen.getByText("Login");
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute("href", "/login");
    });

    it("renders all form labels", () => {
      renderSignup();

      expect(screen.getByText("Email Address")).toBeInTheDocument();
      expect(screen.getByText("Password")).toBeInTheDocument();
      expect(screen.getByText("Confirm Password")).toBeInTheDocument();
    });
  });

  describe("Form Input", () => {
    it("updates email input value", () => {
      renderSignup();

      const emailInput = screen.getByPlaceholderText("your.email@example.com");
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("updates password input value", () => {
      renderSignup();

      const passwordInput = screen.getByPlaceholderText(
        "Create a password (min. 6 characters)"
      );
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      expect(passwordInput).toHaveValue("password123");
    });

    it("updates confirm password input value", () => {
      renderSignup();

      const confirmInput = screen.getByPlaceholderText("Confirm your password");
      fireEvent.change(confirmInput, { target: { value: "password123" } });

      expect(confirmInput).toHaveValue("password123");
    });

    it("all inputs have required attribute", () => {
      renderSignup();

      const emailInput = screen.getByPlaceholderText("your.email@example.com");
      const passwordInput = screen.getByPlaceholderText(
        "Create a password (min. 6 characters)"
      );
      const confirmInput = screen.getByPlaceholderText("Confirm your password");

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
      expect(confirmInput).toBeRequired();
    });
  });

  describe("Form Validation", () => {
    it("shows error when passwords do not match", async () => {
      renderSignup();

      const emailInput = screen.getByPlaceholderText("your.email@example.com");
      const passwordInput = screen.getByPlaceholderText(
        "Create a password (min. 6 characters)"
      );
      const confirmInput = screen.getByPlaceholderText("Confirm your password");
      const submitButton = screen.getByRole("button", { name: "Sign Up" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmInput, {
        target: { value: "differentpassword" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
      });

      expect(mockSignup).not.toHaveBeenCalled();
    });

    it("shows error when password is too short", async () => {
      renderSignup();

      const emailInput = screen.getByPlaceholderText("your.email@example.com");
      const passwordInput = screen.getByPlaceholderText(
        "Create a password (min. 6 characters)"
      );
      const confirmInput = screen.getByPlaceholderText("Confirm your password");
      const submitButton = screen.getByRole("button", { name: "Sign Up" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "12345" } });
      fireEvent.change(confirmInput, { target: { value: "12345" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Password must be at least 6 characters long")
        ).toBeInTheDocument();
      });

      expect(mockSignup).not.toHaveBeenCalled();
    });
  });

  describe("Form Submission", () => {
    it("calls signup with form data on valid submission", async () => {
      mockSignup.mockResolvedValue({ success: true });
      renderSignup();

      const emailInput = screen.getByPlaceholderText("your.email@example.com");
      const passwordInput = screen.getByPlaceholderText(
        "Create a password (min. 6 characters)"
      );
      const confirmInput = screen.getByPlaceholderText("Confirm your password");
      const submitButton = screen.getByRole("button", { name: "Sign Up" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledWith(
          "test@example.com",
          "password123"
        );
      });
    });

    it("navigates to home on successful signup", async () => {
      mockSignup.mockResolvedValue({ success: true });
      renderSignup();

      const emailInput = screen.getByPlaceholderText("your.email@example.com");
      const passwordInput = screen.getByPlaceholderText(
        "Create a password (min. 6 characters)"
      );
      const confirmInput = screen.getByPlaceholderText("Confirm your password");
      const submitButton = screen.getByRole("button", { name: "Sign Up" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("displays error message on failed signup", async () => {
      mockSignup.mockResolvedValue({
        success: false,
        error: "Email already exists",
      });
      renderSignup();

      const emailInput = screen.getByPlaceholderText("your.email@example.com");
      const passwordInput = screen.getByPlaceholderText(
        "Create a password (min. 6 characters)"
      );
      const confirmInput = screen.getByPlaceholderText("Confirm your password");
      const submitButton = screen.getByRole("button", { name: "Sign Up" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Email already exists")).toBeInTheDocument();
      });
    });

    it("does not navigate on failed signup", async () => {
      mockSignup.mockResolvedValue({
        success: false,
        error: "Email already exists",
      });
      renderSignup();

      const emailInput = screen.getByPlaceholderText("your.email@example.com");
      const passwordInput = screen.getByPlaceholderText(
        "Create a password (min. 6 characters)"
      );
      const confirmInput = screen.getByPlaceholderText("Confirm your password");
      const submitButton = screen.getByRole("button", { name: "Sign Up" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Email already exists")).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("shows loading spinner during submission", async () => {
      let resolveSignup: (value: { success: boolean }) => void;
      const signupPromise = new Promise<{ success: boolean }>((resolve) => {
        resolveSignup = resolve;
      });
      mockSignup.mockReturnValue(signupPromise);

      renderSignup();

      const emailInput = screen.getByPlaceholderText("your.email@example.com");
      const passwordInput = screen.getByPlaceholderText(
        "Create a password (min. 6 characters)"
      );
      const confirmInput = screen.getByPlaceholderText("Confirm your password");
      const submitButton = screen.getByRole("button", { name: "Sign Up" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Creating account...")).toBeInTheDocument();
      });

      resolveSignup!({ success: true });

      await waitFor(() => {
        expect(
          screen.queryByText("Creating account...")
        ).not.toBeInTheDocument();
      });
    });

    it("disables submit button during loading", async () => {
      let resolveSignup: (value: { success: boolean }) => void;
      const signupPromise = new Promise<{ success: boolean }>((resolve) => {
        resolveSignup = resolve;
      });
      mockSignup.mockReturnValue(signupPromise);

      renderSignup();

      const emailInput = screen.getByPlaceholderText("your.email@example.com");
      const passwordInput = screen.getByPlaceholderText(
        "Create a password (min. 6 characters)"
      );
      const confirmInput = screen.getByPlaceholderText("Confirm your password");
      const submitButton = screen.getByRole("button", { name: "Sign Up" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const loadingButton = screen.getByRole("button");
        expect(loadingButton).toBeDisabled();
      });

      resolveSignup!({ success: true });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Sign Up" })
        ).not.toBeDisabled();
      });
    });
  });
});
