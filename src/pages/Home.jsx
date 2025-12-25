import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Transaction from "../components/Transaction";
import Modal from "../components/Modal";
import apiService from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [expensesData, categoriesData] = await Promise.all([
        apiService.getExpenses(),
        apiService.getCategories(),
      ]);

      setTransactions(Array.isArray(expensesData) ? expensesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error("Load data error:", err);
      setError(err.message);
      setTransactions([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await apiService.deleteExpense(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("Failed to delete transaction: " + err.message);
    }
  };

  const handleEdit = (transaction) => {
    const numericValue = Number(transaction.value);
    setEditingTransaction({
      ...transaction,
      categoryId: transaction.category?.id || transaction.categoryId,
      value: Math.abs(numericValue).toString(), // Always show positive
      type: numericValue >= 0 ? "income" : "expense", // Determine type from sign
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();

    try {
      // Convert value based on type
      const numericValue = parseFloat(editingTransaction.value);
      const finalValue =
        editingTransaction.type === "expense"
          ? -Math.abs(numericValue)
          : Math.abs(numericValue);

      await apiService.updateExpense(editingTransaction.id, {
        title: editingTransaction.title,
        categoryId: editingTransaction.categoryId,
        value: finalValue,
      });

      await loadData();
      setIsEditModalOpen(false);
      setEditingTransaction(null);
    } catch (err) {
      alert("Failed to update transaction: " + err.message);
    }
  };

  const getCategoryName = (transaction) => {
    if (transaction.category && transaction.category.name) {
      return transaction.category.name;
    }
    const category = categories.find((c) => c.id === transaction.categoryId);
    return category ? category.name : "Unknown";
  };

  const totalIncome = transactions
    .filter((t) => Number(t.value) > 0)
    .reduce((sum, t) => sum + Number(t.value), 0);

  const totalExpenses = transactions
    .filter((t) => Number(t.value) < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.value)), 0);

  const balance = totalIncome - totalExpenses;

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date);
    const dateB = new Date(b.createdAt || b.date);
    return dateB - dateA;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {!isAuthenticated && transactions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">
            You're viewing transactions in read-only mode.
            <button
              onClick={() => navigate("/login")}
              className="ml-2 underline font-semibold hover:text-blue-800"
            >
              Login
            </button>{" "}
            to create, edit, or delete transactions.
          </p>
        </div>
      )}

      {!isAuthenticated && transactions.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">
            No transactions available.
            <button
              onClick={() => navigate("/login")}
              className="ml-2 underline font-semibold hover:text-blue-800"
            >
              Login
            </button>{" "}
            to start tracking your expenses.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total Balance
              </h3>
            </div>
            <p
              className={`text-4xl font-bold ${
                balance >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                Total Income
              </h3>
            </div>
            <p className="text-4xl font-bold text-emerald-600">
              +${totalIncome.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-rose-100 border-2 border-rose-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-rose-700 uppercase tracking-wide">
                Total Expenses
              </h3>
            </div>
            <p className="text-4xl font-bold text-rose-600">
              -${totalExpenses.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900">
          Recent Transactions
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">
            {transactions.length} transactions
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg font-semibold mb-2">No transactions yet</p>
            {isAuthenticated ? (
              <>
                <p className="text-gray-600 mb-4">
                  Start tracking your expenses by creating your first
                  transaction
                </p>
                <button
                  onClick={() => navigate("/create-transaction")}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold transition-all transform hover:scale-105"
                >
                  Create Your First Transaction
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  Login to start tracking your expenses
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold transition-all transform hover:scale-105"
                >
                  Login to Continue
                </button>
              </>
            )}
          </div>
        ) : (
          sortedTransactions.map((transaction) => (
            <Transaction
              key={transaction.id}
              transaction={transaction}
              categoryName={getCategoryName(transaction)}
              onDelete={handleDelete}
              onEdit={handleEdit}
              showActions={isAuthenticated}
            />
          ))
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTransaction(null);
        }}
        title="Edit Transaction"
      >
        {editingTransaction && (
          <form onSubmit={handleUpdateTransaction} className="space-y-4">
            {/* Transaction Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditingTransaction({
                      ...editingTransaction,
                      type: "expense",
                    })
                  }
                  className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    editingTransaction.type === "expense"
                      ? "bg-rose-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEditingTransaction({
                      ...editingTransaction,
                      type: "income",
                    })
                  }
                  className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    editingTransaction.type === "income"
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={editingTransaction.title}
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction,
                    title: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={editingTransaction.categoryId}
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction,
                    categoryId: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={editingTransaction.value}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      value: e.target.value,
                    })
                  }
                  className={`w-full pl-8 pr-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-gray-900 ${
                    editingTransaction.type === "expense"
                      ? "border-rose-300 bg-rose-50"
                      : "border-emerald-300 bg-emerald-50"
                  }`}
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Enter as positive number - will be saved as{" "}
                {editingTransaction.type}
              </p>
            </div>

            {/* Preview */}
            <div
              className={`p-3 rounded-lg border-2 ${
                editingTransaction.type === "expense"
                  ? "bg-rose-50 border-rose-200"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Preview:
                </span>
                <span
                  className={`text-xl font-bold ${
                    editingTransaction.type === "expense"
                      ? "text-rose-600"
                      : "text-emerald-600"
                  }`}
                >
                  {editingTransaction.type === "expense" ? "-" : "+"}$
                  {editingTransaction.value || "0.00"}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-[1.02]"
              >
                Update Transaction
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingTransaction(null);
                }}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all transform hover:scale-[1.02]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Home;
