import React from "react";
import { BarChart, XAxis, YAxis, Bar, Tooltip, Legend, CartesianGrid } from "recharts";

const ExpenseTrendsChart = ({ expenses }) => {
  const data = Object.values(
    expenses.reduce((acc, exp) => {
      acc[exp.category] = acc[exp.category] || {
        category: exp.category,
        amount: 0,
      };
      acc[exp.category].amount += exp.amount;
      return acc;
    }, {})
  );

  return (
    <div>
      <h2>Spending Trends</h2>
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default ExpenseTrendsChart;