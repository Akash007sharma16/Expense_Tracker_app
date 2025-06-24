import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// Chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2"];

function ExpenseCharts() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/expenses")
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error("Error fetching expenses:", err));
  }, []);

  // ✅ Category-wise data for Pie chart
  const categoryData = Object.values(
    expenses.reduce((acc, expense) => {
      const category = expense.category;
      acc[category] = acc[category] || { name: category, value: 0 };
      acc[category].value += expense.amount;
      return acc;
    }, {})
  );

  // ✅ Month-wise data for Bar chart
  const monthlyData = Object.values(
    expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      acc[month] = acc[month] || { month, total: 0 };
      acc[month].total += expense.amount;
      return acc;
    }, {})
  );

  return (
    <div style={{ marginTop: "40px", textAlign: "center" }}>
      <h2 style={{ marginBottom: "30px" }}>📊 Expense Insights</h2>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "60px" }}>
        {/* Pie Chart */}
        <div>
          <h3>Category-wise Breakdown</h3>
          <PieChart width={320} height={320}>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
            >
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Bar Chart */}
        <div>
          <h3>Monthly Trends</h3>
          <BarChart width={500} height={300} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default ExpenseCharts;
