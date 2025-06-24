import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Papa from "papaparse";

// 🔹 Category icon mapper
const getCategoryIcon = (category) => {
  switch (category) {
    case "Food":
      return "🍔 Food";
    case "Shopping":
      return "🛍️ Shopping";
    case "Travel":
      return "✈️ Travel";
    case "Rent":
      return "🏠 Rent";
    default:
      return `📦 ${category}`;
  }
};

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    amount: "",
    category: "",
    description: "",
    date: ""
  });

  const [filterCategory, setFilterCategory] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await axios.delete(`http://localhost:5000/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setEditData({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date.split("T")[0]
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/expenses/${id}`, editData);
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      console.error("Error updating expense:", err);
    }
  };

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(expenses);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "expenses.csv");
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchCategory = filterCategory ? expense.category === filterCategory : true;
    const matchMonth = filterMonth
      ? new Date(expense.date).toISOString().slice(0, 7) === filterMonth
      : true;
    return matchCategory && matchMonth;
  });

  return (
    <div>
      <h2>All Expenses</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Filter by Category:{" "}
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Travel">Travel</option>
            <option value="Rent">Rent</option>
          </select>
        </label>

        <label style={{ marginLeft: "20px" }}>
          Filter by Month:{" "}
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />
        </label>

        <button onClick={handleDownloadCSV} style={{ marginLeft: "20px" }}>
          📥 Download CSV
        </button>
      </div>

      {filteredExpenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense._id}>
                {editingId === expense._id ? (
                  <>
                    <td>
                      <input
                        type="number"
                        name="amount"
                        value={editData.amount}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        name="category"
                        value={editData.category}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        name="description"
                        value={editData.description}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="date"
                        value={editData.date}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleUpdate(expense._id)}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>₹{expense.amount}</td>
                    <td>{getCategoryIcon(expense.category)}</td>
                    <td>{expense.description}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleEdit(expense)}>Edit</button>
                      <button onClick={() => handleDelete(expense._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ExpenseList;
