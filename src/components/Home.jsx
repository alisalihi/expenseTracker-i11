import React from "react";
import Transaction from "./Transaction";

const Home = () => {
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
    {
      id: 13,
      title: "Website Design",
      category: "Income",
      amount: 3000.0,
      date: "2025-2-10",
    },
    {
      id: 14,
      title: "Car Crash",
      category: "Income",
      amount: -4500.0,
      date: "2025-10-10",
    },
  ];

  const totalIncome = transactions
    .filter((t) => Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => Number(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const balance = totalIncome - totalExpenses;
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  return (
    <div className="flex flex-col">
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
        {sortedTransactions.map((transaction) => (
          <Transaction key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};
export default Home;
