const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    return {
      "Content-Type": "application/json",
    };
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(
        error.message ||
          error.detail ||
          `Request failed with status ${response.status}`
      );
    }

    if (response.status === 204) {
      return { success: true };
    }

    return response.json();
  }

  // Auth endpoints
  async signup(email, password) {
    const response = await fetch(`${this.baseURL}/signup`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/login`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await this.handleResponse(response);

    // Store email for UI display
    localStorage.setItem("email", email);
    localStorage.setItem("isAuthenticated", "true");

    return data;
  }

  async logout() {
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

  // Categories endpoint
  async getCategories() {
    const response = await fetch(`${this.baseURL}/categories`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    return this.handleResponse(response);
  }

  // Expense endpoints
  async getExpenses() {
    const response = await fetch(`${this.baseURL}/expenses`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    return this.handleResponse(response);
  }

  async getExpense(id) {
    const response = await fetch(`${this.baseURL}/expense/${id}`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    return this.handleResponse(response);
  }

  async createExpense(expense) {
    const response = await fetch(`${this.baseURL}/expenses`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        title: expense.title,
        value: parseFloat(expense.value),
        categoryId: parseInt(expense.categoryId),
      }),
    });
    return this.handleResponse(response);
  }

  async updateExpense(id, expense) {
    const response = await fetch(`${this.baseURL}/expenses/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        title: expense.title,
        value: parseFloat(expense.value),
        categoryId: parseInt(expense.categoryId),
      }),
    });
    return this.handleResponse(response);
  }

  async deleteExpense(id) {
    const response = await fetch(`${this.baseURL}/expenses/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    return this.handleResponse(response);
  }
}

export default new ApiService();
