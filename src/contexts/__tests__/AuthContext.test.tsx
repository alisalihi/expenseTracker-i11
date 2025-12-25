// src/contexts/__tests__/AuthContext.test.tsx
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";

// Mock the API service
jest.mock("../../services/api", () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
  },
}));

// Import after mock
import apiService from "../../services/api";

const mockApiService = apiService as jest.Mocked<typeof apiService>;

// Test component to access auth context
const TestComponent = () => {
  const { user, isAuthenticated, loading, login, signup, logout } = useAuth();

  return (
    <div>
      <div data-testid="loading">{loading ? "loading" : "not-loading"}</div>
      <div data-testid="authenticated">
        {isAuthenticated ? "authenticated" : "not-authenticated"}
      </div>
      <div data-testid="user-email">{user?.email || "no-user"}</div>
      <button
        data-testid="login-btn"
        onClick={() => login("test@example.com", "password")}
      >
        Login
      </button>
      <button
        data-testid="signup-btn"
        onClick={() => signup("test@example.com", "password")}
      >
        Signup
      </button>
      <button data-testid="logout-btn" onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("AuthProvider", () => {
    it("provides auth context to children", () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId("loading")).toBeInTheDocument();
      expect(screen.getByTestId("authenticated")).toBeInTheDocument();
    });

    it("initializes with loading state then completes", async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("not-loading");
      });
    });

    it("initializes as not authenticated when no stored data", async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("authenticated")).toHaveTextContent(
          "not-authenticated"
        );
        expect(screen.getByTestId("user-email")).toHaveTextContent("no-user");
      });
    });

    it("restores authentication from localStorage", async () => {
      localStorage.setItem("email", "stored@example.com");
      localStorage.setItem("isAuthenticated", "true");

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("authenticated")).toHaveTextContent(
          "authenticated"
        );
        expect(screen.getByTestId("user-email")).toHaveTextContent(
          "stored@example.com"
        );
      });
    });

    it("does not restore authentication when isAuthenticated is not 'true'", async () => {
      localStorage.setItem("email", "stored@example.com");
      localStorage.setItem("isAuthenticated", "false");

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("authenticated")).toHaveTextContent(
          "not-authenticated"
        );
      });
    });
  });

  describe("login", () => {
    it("logs in successfully and updates state", async () => {
      mockApiService.login.mockResolvedValue({ message: "Success" });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("not-loading");
      });

      await act(async () => {
        screen.getByTestId("login-btn").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("authenticated")).toHaveTextContent(
          "authenticated"
        );
        expect(screen.getByTestId("user-email")).toHaveTextContent(
          "test@example.com"
        );
      });

      expect(mockApiService.login).toHaveBeenCalledWith(
        "test@example.com",
        "password"
      );
    });

    it("handles login failure and stays unauthenticated", async () => {
      mockApiService.login.mockRejectedValue(new Error("Invalid credentials"));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("not-loading");
      });

      await act(async () => {
        screen.getByTestId("login-btn").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("authenticated")).toHaveTextContent(
          "not-authenticated"
        );
      });
    });
  });

  describe("signup", () => {
    it("signs up successfully and logs in", async () => {
      mockApiService.signup.mockResolvedValue({ email: "test@example.com" });
      mockApiService.login.mockResolvedValue({ message: "Success" });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("not-loading");
      });

      await act(async () => {
        screen.getByTestId("signup-btn").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("authenticated")).toHaveTextContent(
          "authenticated"
        );
      });

      expect(mockApiService.signup).toHaveBeenCalledWith(
        "test@example.com",
        "password"
      );
      expect(mockApiService.login).toHaveBeenCalledWith(
        "test@example.com",
        "password"
      );
    });

    it("handles signup failure", async () => {
      mockApiService.signup.mockRejectedValue(
        new Error("Email already exists")
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("not-loading");
      });

      await act(async () => {
        screen.getByTestId("signup-btn").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("authenticated")).toHaveTextContent(
          "not-authenticated"
        );
      });
    });
  });

  describe("logout", () => {
    it("logs out successfully and clears state", async () => {
      mockApiService.logout.mockResolvedValue(undefined);
      localStorage.setItem("email", "test@example.com");
      localStorage.setItem("isAuthenticated", "true");

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("authenticated")).toHaveTextContent(
          "authenticated"
        );
      });

      await act(async () => {
        screen.getByTestId("logout-btn").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("authenticated")).toHaveTextContent(
          "not-authenticated"
        );
        expect(screen.getByTestId("user-email")).toHaveTextContent("no-user");
      });

      expect(mockApiService.logout).toHaveBeenCalled();
    });
  });

  describe("useAuth hook", () => {
    it("throws error when used outside AuthProvider", () => {
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow("useAuth must be used within AuthProvider");

      consoleError.mockRestore();
    });
  });
});
