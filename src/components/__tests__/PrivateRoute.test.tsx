import { render, screen } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import { useAuth } from "../../contexts/AuthContext";

// Mock the AuthContext
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("PrivateRoute", () => {
  const defaultAuthState = {
    isAuthenticated: false,
    loading: false,
    user: null,
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPrivateRoute = (authState = defaultAuthState) => {
    mockUseAuth.mockReturnValue(authState);
    return render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <div data-testid="protected-content">Protected Content</div>
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={<div data-testid="login-page">Login Page</div>}
          />
        </Routes>
      </BrowserRouter>
    );
  };

  describe("Loading State", () => {
    it("shows loading spinner when loading is true", () => {
      renderPrivateRoute({
        ...defaultAuthState,
        loading: true,
      });

      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("does not show protected content when loading", () => {
      renderPrivateRoute({
        ...defaultAuthState,
        loading: true,
      });

      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("does not redirect to login when loading", () => {
      renderPrivateRoute({
        ...defaultAuthState,
        loading: true,
      });

      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
    });
  });

  describe("Authenticated User", () => {
    it("renders children when user is authenticated", () => {
      renderPrivateRoute({
        ...defaultAuthState,
        isAuthenticated: true,
        user: { email: "test@example.com" },
      });

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("does not show loading spinner when authenticated", () => {
      renderPrivateRoute({
        ...defaultAuthState,
        isAuthenticated: true,
        user: { email: "test@example.com" },
      });

      const spinner = document.querySelector(".animate-spin");
      expect(spinner).not.toBeInTheDocument();
    });

    it("does not redirect to login when authenticated", () => {
      renderPrivateRoute({
        ...defaultAuthState,
        isAuthenticated: true,
        user: { email: "test@example.com" },
      });

      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
    });
  });

  describe("Unauthenticated User", () => {
    it("redirects to login when user is not authenticated", () => {
      renderPrivateRoute({
        ...defaultAuthState,
        isAuthenticated: false,
      });

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });

    it("does not render children when not authenticated", () => {
      renderPrivateRoute({
        ...defaultAuthState,
        isAuthenticated: false,
      });

      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("does not show loading spinner when not authenticated", () => {
      renderPrivateRoute({
        ...defaultAuthState,
        isAuthenticated: false,
      });

      const spinner = document.querySelector(".animate-spin");
      expect(spinner).not.toBeInTheDocument();
    });
  });
});
