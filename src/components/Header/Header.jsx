import React from "react";

const Header = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black text-white shadow-md z-50">
      <div className="px-4 md:px-6 py-4 flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="text-xl md:text-2xl font-bold">
          Expense Tracker App - Inspire 11
        </h1>
      </div>
    </header>
  );
};

export default Header;
