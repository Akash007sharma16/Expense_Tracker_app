import React, { useState } from "react";
import axios from "axios";

function ExpenseForm() {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/expenses", formData);
      setFormData({ amount: "", category: "", description: "", date: "" });
      alert("Expense added!");
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="amount" type="number" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
      <input name="category" type="text" placeholder="Category" value={formData.category} onChange={handleChange} required />
      <input name="description" type="text" placeholder="Description" value={formData.description} onChange={handleChange} required />
      <input name="date" type="date" value={formData.date} onChange={handleChange} required />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
