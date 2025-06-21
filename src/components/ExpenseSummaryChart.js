import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

const ExpenseSummaryChart = ({ expenses }) => {
  const data = Object.values(
    expenses.reduce((acc, exp) => {
      acc[exp.category] = acc[exp.category] || {
        name: exp.category,
        value: 0,
      };
      acc[exp.category].value += exp.amount;
      return acc;
    }, {})
  );

  return (
    <div>
      <h2>Expense Summary</h2>
      <PieChart width={300} height={300}>
        <Pie
          dataKey="value"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ExpenseSummaryChart;
