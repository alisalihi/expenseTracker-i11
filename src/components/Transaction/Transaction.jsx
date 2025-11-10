import React from "react";
import PropTypes from "prop-types";

const Transaction = ({ title, category, amount, date }) => {
  const formattedAmount = `$${Math.abs(amount).toFixed(2)}`;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-black">{title}</h3>
        <span
          className={`text-lg font-semibold ${
            amount >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {amount >= 0 ? "+" : "-"}
          {formattedAmount}
        </span>
      </div>

      <div className="flex gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <span className="font-medium">Category:</span>
          <span>{category}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">Date:</span>
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-3 border-t border-gray-200">
        <button
          className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors duration-200 font-medium"
          onClick={() => console.log("Edit clicked for:", title)}
        >
          Edit
        </button>
        <button
          className="flex-1 px-4 py-2 bg-white text-black border-2 border-black rounded hover:bg-gray-100 transition-colors duration-200 font-medium"
          onClick={() => console.log("Delete clicked for:", title)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

Transaction.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
};

export default Transaction;
