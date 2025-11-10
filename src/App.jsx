import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Transaction from "./components/Transaction/Transaction";

function App() {
  const sampleTransactions = [
    {
      id: 1,
      title: "Grocery Shopping",
      category: "Food",
      amount: -85.5,
      date: "2025-11-08",
    },
    {
      id: 2,
      title: "Salary",
      category: "Income",
      amount: 3000.0,
      date: "2025-11-01",
    },
    {
      id: 3,
      title: "Electric Bill",
      category: "Utilities",
      amount: -120.0,
      date: "2025-11-05",
    },
  ];

  return (
    <>
      <Header />
      <Sidebar />

      <main className="ml-64 mt-16 p-6">
        <div className="space-y-4">
          {sampleTransactions.map((transaction) => (
            <Transaction
              key={transaction.id}
              title={transaction.title}
              category={transaction.category}
              amount={transaction.amount}
              date={transaction.date}
            />
          ))}
        </div>
      </main>
    </>
  );
}

export default App;
