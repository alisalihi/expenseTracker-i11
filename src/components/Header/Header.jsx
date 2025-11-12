import React from "react";
import inspireLogo from "../../assets/inspireLogo.webp";

const Header = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg z-50 border-b border-gray-700">
      <div className="px-4 md:px-6 py-4 flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 hover:bg-gray-700/50 rounded-lg transition-all duration-200 active:scale-95"
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

        <div className="flex items-center gap-3">
          <img
            src={inspireLogo}
            alt="Inspire Logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Expense Tracker - Inspire 11
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
