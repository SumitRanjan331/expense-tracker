import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  return (
    <div className="expense-list">
      <h2>Expense History</h2>
      {expenses.length === 0 ? (
        <p>No expenses added.</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              <span>
                {expense.title} - ₹{expense.amount} ({expense.category})
              </span>
              <span>
                <FaEdit onClick={() => onEdit(expense)} />
                <FaTrash onClick={() => onDelete(expense.id)} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;