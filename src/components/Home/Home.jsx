import React from "react";
import Transaction from "../Transaction/Transaction";

const Home = () => {
  // Sample transaction data array for testing
  const transactions = [
    {
      id: 1,
      title: "Salary Deposit",
      category: "Income",
      amount: 3500.0,
      date: "2025-11-01",
    },
    {
      id: 2,
      title: "Grocery Shopping",
      category: "Food",
      amount: -125.5,
      date: "2025-11-02",
    },
    {
      id: 3,
      title: "Electric Bill",
      category: "Utilities",
      amount: -89.99,
      date: "2025-11-03",
    },
    {
      id: 4,
      title: "Netflix Subscription",
      category: "Entertainment",
      amount: -15.99,
      date: "2025-11-04",
    },
    {
      id: 5,
      title: "Gas Station",
      category: "Transportation",
      amount: -45.0,
      date: "2025-11-05",
    },
    {
      id: 6,
      title: "Freelance Project",
      category: "Income",
      amount: 800.0,
      date: "2025-11-06",
    },
    {
      id: 7,
      title: "Restaurant Dinner",
      category: "Food",
      amount: -67.5,
      date: "2025-11-07",
    },
    {
      id: 8,
      title: "Internet Bill",
      category: "Utilities",
      amount: -59.99,
      date: "2025-11-08",
    },
    {
      id: 9,
      title: "Gym Membership",
      category: "Health",
      amount: -49.99,
      date: "2025-11-09",
    },
    {
      id: 10,
      title: "Online Course",
      category: "Education",
      amount: -199.0,
      date: "2025-11-10",
    },
    {
      id: 11,
      title: "Coffee Shop",
      category: "Food",
      amount: -12.5,
      date: "2025-11-10",
    },
    {
      id: 12,
      title: "Bonus Payment",
      category: "Income",
      amount: 500.0,
      date: "2025-11-10",
    },
  ];

  // ✅ Ensure numeric values before calculations
  const totalIncome = transactions
    .filter((t) => Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => Number(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="flex flex-col h-full p-4 md:p-6 bg-gray-50">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Total Balance
          </h3>
          <p
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${balance.toFixed(2)}
          </p>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Total Income
          </h3>
          <p className="text-2xl font-bold text-green-600">
            +${totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold text-red-600">
            -${totalExpenses.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Transactions Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-black">Recent Transactions</h2>
        <span className="text-sm text-gray-600">
          {transactions.length} transactions
        </span>
      </div>

      {/* Scrollable Transaction List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 pb-8">
          {transactions.map((transaction) => (
            <Transaction key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
