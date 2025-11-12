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

        <main className="flex-1 ml-64 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <Home />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
