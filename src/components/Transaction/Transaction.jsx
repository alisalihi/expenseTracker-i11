import React from "react";

const Transaction = ({ transaction }) => {
  if (!transaction) return null;

  const { title, category, amount, date } = transaction;

  const numericAmount = Number(amount);
  const formattedAmount =
    !isNaN(numericAmount) && numericAmount !== null
      ? numericAmount.toFixed(2)
      : "0.00";

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-500">
            Category: {category} &nbsp; | &nbsp; Date: {formattedDate}
          </p>
        </div>
        <p
          className={`text-lg font-bold ${
            numericAmount >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {numericAmount >= 0
            ? `+$${formattedAmount}`
            : `-$${Math.abs(numericAmount).toFixed(2)}`}
        </p>
      </div>

      <div className="flex justify-between mt-4">
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
          Edit
        </button>
        <button className="border border-black text-black px-4 py-2 rounded hover:bg-gray-100 transition">
          Delete
        </button>
      </div>
    </div>
  );
};

export default Transaction;
