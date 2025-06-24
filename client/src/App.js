import React from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseCharts from "./components/ExpenseCharts";

function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>💰 Expense Tracker</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Add New Expense</h2>
        <ExpenseForm />
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <ExpenseList />
      </section>

      <section>
        <ExpenseCharts />
      </section>
    </div>
  );
}

export default App;
