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

  const getCategoryColor = (category) => {
    const colors = {
      Income: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Food: 'bg-orange-50 text-orange-700 border-orange-200',
      Utilities: 'bg-blue-50 text-blue-700 border-blue-200',
      Entertainment: 'bg-purple-50 text-purple-700 border-purple-200',
      Transportation: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      Health: 'bg-red-50 text-red-700 border-red-200',
      Education: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-lg mb-2 truncate">{title}</h4>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className={`px-3 py-1 rounded-full border font-medium ${getCategoryColor(category)}`}>
              {category}
            </span>
            <span className="text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <p
            className={`text-2xl font-bold ${
              numericAmount >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {numericAmount >= 0
              ? `+$${formattedAmount}`
              : `-$${Math.abs(numericAmount).toFixed(2)}`}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
        <button className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-800 active:bg-gray-950 transition-all duration-200 hover:shadow-md">
          Edit
        </button>
        <button className="flex-1 border-2 border-gray-900 text-gray-900 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 active:bg-gray-100 transition-all duration-200">
          Delete
        </button>
      </div>
    </div>
  );
};

export default Transaction;