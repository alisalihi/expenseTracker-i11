// src/components/__tests__/Sidebar.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../Sidebar";
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

describe("Sidebar", () => {
  const mockOnClose = jest.fn();

  const defaultAuthState = {
    isAuthenticated: false,
    loading: false,
    user: null,
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
  };

  const authenticatedState = {
    ...defaultAuthState,
    isAuthenticated: true,
    user: { email: "test@example.com" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(defaultAuthState);
  });

  const renderSidebar = (isOpen = true, authState = defaultAuthState) => {
    mockUseAuth.mockReturnValue(authState);
    return render(
      <BrowserRouter>
        <Sidebar isOpen={isOpen} onClose={mockOnClose} />
      </BrowserRouter>
    );
  };

  describe("Rendering", () => {
    it("renders sidebar when open", () => {
      renderSidebar(true);

      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("applies correct transform class when open", () => {
      renderSidebar(true);

      const aside = screen.getByRole("complementary");
      expect(aside).toHaveClass("translate-x-0");
    });

    it("applies correct transform class when closed", () => {
      renderSidebar(false);

      const aside = screen.getByRole("complementary");
      expect(aside).toHaveClass("-translate-x-full");
    });

    it("shows overlay when sidebar is open", () => {
      renderSidebar(true);

      const overlay = document.querySelector('[aria-hidden="true"]');
      expect(overlay).toBeInTheDocument();
    });

    it("does not show overlay when sidebar is closed", () => {
      renderSidebar(false);

      const overlay = document.querySelector('[aria-hidden="true"]');
      expect(overlay).not.toBeInTheDocument();
    });
  });

  describe("Unauthenticated User", () => {
    it("shows Home link", () => {
      renderSidebar(true);

      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("shows Login link", () => {
      renderSidebar(true);

      expect(screen.getByText("Login")).toBeInTheDocument();
    });

    it("shows Sign Up link", () => {
      renderSidebar(true);

      expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    it("does not show New Transaction link", () => {
      renderSidebar(true);

      expect(screen.queryByText("New Transaction")).not.toBeInTheDocument();
    });

    it("does not show Logout button", () => {
      renderSidebar(true);

      expect(screen.queryByText("Logout")).not.toBeInTheDocument();
    });

    it("does not show user info", () => {
      renderSidebar(true);

      expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
      expect(screen.queryByText("Logged in")).not.toBeInTheDocument();
    });
  });

  describe("Authenticated User", () => {
    it("shows Home link", () => {
      renderSidebar(true, authenticatedState);

      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("shows New Transaction link", () => {
      renderSidebar(true, authenticatedState);

      expect(screen.getByText("New Transaction")).toBeInTheDocument();
    });

    it("shows Logout button", () => {
      renderSidebar(true, authenticatedState);

      expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("does not show Login link", () => {
      renderSidebar(true, authenticatedState);

      expect(screen.queryByText("Login")).not.toBeInTheDocument();
    });

    it("does not show Sign Up link", () => {
      renderSidebar(true, authenticatedState);

      expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
    });

    it("displays user email", () => {
      renderSidebar(true, authenticatedState);

      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("displays logged in status", () => {
      renderSidebar(true, authenticatedState);

      expect(screen.getByText("Logged in")).toBeInTheDocument();
    });

    it("displays user initial in avatar", () => {
      renderSidebar(true, authenticatedState);

      expect(screen.getByText("T")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("navigates to home and closes sidebar when Home is clicked", () => {
      renderSidebar(true);

      fireEvent.click(screen.getByText("Home"));

      expect(mockNavigate).toHaveBeenCalledWith("/");
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("navigates to login and closes sidebar when Login is clicked", () => {
      renderSidebar(true);

      fireEvent.click(screen.getByText("Login"));

      expect(mockNavigate).toHaveBeenCalledWith("/login");
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("navigates to signup and closes sidebar when Sign Up is clicked", () => {
      renderSidebar(true);

      fireEvent.click(screen.getByText("Sign Up"));

      expect(mockNavigate).toHaveBeenCalledWith("/signup");
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("navigates to create-transaction when New Transaction is clicked", () => {
      renderSidebar(true, authenticatedState);

      fireEvent.click(screen.getByText("New Transaction"));

      expect(mockNavigate).toHaveBeenCalledWith("/create-transaction");
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("Logout", () => {
    it("calls logout and navigates to login when Logout is clicked", async () => {
      const logoutMock = jest.fn().mockResolvedValue(undefined);
      const authStateWithLogout = {
        ...authenticatedState,
        logout: logoutMock,
      };

      renderSidebar(true, authStateWithLogout);

      fireEvent.click(screen.getByText("Logout"));

      await waitFor(() => {
        expect(logoutMock).toHaveBeenCalled();
      });

      expect(mockNavigate).toHaveBeenCalledWith("/login");
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("Close Button", () => {
    it("calls onClose when close button is clicked", () => {
      renderSidebar(true);

      const closeButton = screen.getByLabelText("Close menu");
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("calls onClose when overlay is clicked", () => {
      renderSidebar(true);

      const overlay = document.querySelector('[aria-hidden="true"]');
      if (overlay) {
        fireEvent.click(overlay);
      }

      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});