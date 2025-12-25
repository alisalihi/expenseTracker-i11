export interface User {
  email: string;
  token?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  title: string;
  value: number;
  categoryId: number;
  category?: Category;
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionFormData {
  title: string;
  categoryId: string | number;
  value: string | number;
  type: "income" | "expense";
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends LoginFormData {
  confirmPassword: string;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
}

export interface AuthResponse {
  token?: string;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}
