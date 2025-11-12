import React from 'react';

const Sidebar = () => {
  const menuItems = [
    { id: 1, label: 'Home' },
    { id: 2, label: 'Create New Transaction' },
    { id: 3, label: 'Login/Signup' },
  ];

  return (
    <aside className="fixed top-16 left-0 h-screen w-64 bg-white border-r border-gray-300 shadow-lg z-40">
      <nav className="py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className="w-full text-left px-6 py-3 text-black hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3"
              >
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;