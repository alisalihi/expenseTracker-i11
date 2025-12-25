import {
  Expense,
  Category,
  AuthResponse,
  User,
  TransactionFormData,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private getAuthHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Request failed",
      }));
      throw new Error(
        error.message ||
          error.detail ||
          `Request failed with status ${response.status}`
      );
    }

    if (response.status === 204) {
      return { success: true } as T;
    }

    return response.json();
  }

  async signup(email: string, password: string): Promise<User> {
    const response = await fetch(`${this.baseURL}/signup`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse<User>(response);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/login`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await this.handleResponse<AuthResponse>(response);
    localStorage.setItem("email", email);
    localStorage.setItem("isAuthenticated", "true");
    return data;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseURL}/logout`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });
    } finally {
      localStorage.removeItem("email");
      localStorage.removeItem("isAuthenticated");
    }
  }

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${this.baseURL}/categories`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    return this.handleResponse<Category[]>(response);
  }

  async getExpenses(): Promise<Expense[]> {
    const response = await fetch(`${this.baseURL}/expenses`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    return this.handleResponse<Expense[]>(response);
  }

  async createExpense(expense: TransactionFormData): Promise<Expense> {
    const response = await fetch(`${this.baseURL}/expenses`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        title: expense.title,
        value:
          typeof expense.value === "string"
            ? parseFloat(expense.value)
            : expense.value,
        categoryId:
          typeof expense.categoryId === "string"
            ? parseInt(expense.categoryId)
            : expense.categoryId,
      }),
    });
    return this.handleResponse<Expense>(response);
  }

  async updateExpense(
    id: number,
    expense: TransactionFormData
  ): Promise<Expense> {
    const response = await fetch(`${this.baseURL}/expenses/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        title: expense.title,
        value:
          typeof expense.value === "string"
            ? parseFloat(expense.value)
            : expense.value,
        categoryId:
          typeof expense.categoryId === "string"
            ? parseInt(expense.categoryId)
            : expense.categoryId,
      }),
    });
    return this.handleResponse<Expense>(response);
  }

  async deleteExpense(id: number): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseURL}/expenses/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    return this.handleResponse<{ success: boolean }>(response);
  }
}

export default new ApiService();
