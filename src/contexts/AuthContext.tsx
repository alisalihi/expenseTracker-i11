import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import apiService from "../services/api";
import { User, AuthContextType, AuthResult } from "../types";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (email && isAuthenticated === "true") {
      setUser({ email });
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      await apiService.login(email, password);
      setUser({ email });
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      return { success: false, error: message };
    }
  };

  const signup = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      await apiService.signup(email, password);
      return await login(email, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      return { success: false, error: message };
    }
  };

  const logout = async (): Promise<void> => {
    await apiService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
