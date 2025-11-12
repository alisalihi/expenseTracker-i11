import { useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./components/Home/Home";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header onMenuClick={toggleSidebar} />

      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <main className="flex-1 lg:ml-64 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <Home />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
