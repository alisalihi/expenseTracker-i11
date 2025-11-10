import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./components/Home/Home";
import "./App.css";

function App() {
  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 pt-16">
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 ml-64 p-6 bg-gray-50 overflow-hidden">
          <Home />
        </main>
      </div>
    </div>
  );
}

export default App;
