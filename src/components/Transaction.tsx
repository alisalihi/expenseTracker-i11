import { Expense } from "../types";

interface TransactionProps {
  transaction: Expense | null;
  categoryName: string;
  onDelete: (id: number) => void;
  onEdit: (transaction: Expense) => void;
  showActions?: boolean;
}

type CategoryName =
  | "Technology"
  | "Science"
  | "Health"
  | "Sports"
  | "Income"
  | "Food"
  | "Utilities"
  | "Entertainment"
  | "Transportation"
  | "Education"
  | "Other";

const categoryColors: Record<CategoryName, string> = {
  Technology: "bg-blue-50 text-blue-700 border-blue-200",
  Science: "bg-green-50 text-green-700 border-green-200",
  Health: "bg-red-50 text-red-700 border-red-200",
  Sports: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Income: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Food: "bg-orange-50 text-orange-700 border-orange-200",
  Utilities: "bg-purple-50 text-purple-700 border-purple-200",
  Entertainment: "bg-pink-50 text-pink-700 border-pink-200",
  Transportation: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Education: "bg-teal-50 text-teal-700 border-teal-200",
  Other: "bg-gray-50 text-gray-700 border-gray-200",
};

const getCategoryColor = (categoryName: string): string => {
  return (
    categoryColors[categoryName as CategoryName] ||
    "bg-gray-50 text-gray-700 border-gray-200"
  );
};

const Transaction = ({
  transaction,
  categoryName,
  onDelete,
  onEdit,
  showActions = false,
}: TransactionProps) => {
  if (!transaction) return null;

  const { title, value, createdAt } = transaction;
  const numericValue = Number(value);
  const formattedValue =
    !isNaN(numericValue) && numericValue !== null
      ? Math.abs(numericValue).toFixed(2)
      : "0.00";

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <div
      data-testid="transaction-card"
      className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h4
            data-testid="transaction-title"
            className="font-semibold text-gray-900 text-lg mb-2 truncate"
          >
            {title}
          </h4>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span
              data-testid="transaction-category"
              className={`px-3 py-1 rounded-full border font-medium ${getCategoryColor(
                categoryName
              )}`}
            >
              {categoryName}
            </span>
            <span
              data-testid="transaction-date"
              className="text-gray-500 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <p
            data-testid="transaction-amount"
            className={`text-2xl font-bold ${
              numericValue >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {numericValue >= 0 ? `+$${formattedValue}` : `-$${formattedValue}`}
          </p>
        </div>
      </div>

      {showActions && (
        <div
          data-testid="transaction-actions"
          className="flex gap-3 mt-5 pt-4 border-t border-gray-100"
        >
          <button
            data-testid="edit-button"
            onClick={() => onEdit(transaction)}
            className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-800 active:bg-gray-950 transition-all duration-200 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Edit
          </button>
          <button
            data-testid="delete-button"
            onClick={() => onDelete(transaction.id)}
            className="flex-1 border-2 border-gray-900 text-gray-900 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Transaction;
