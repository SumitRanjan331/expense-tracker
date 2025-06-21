import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SnackbarProvider, useSnackbar } from "notistack";
import { FaTrash } from "react-icons/fa";
import "./App.css";

Modal.setAppElement("#root");

const CATEGORIES = ["Food", "Entertainment", "Travel"];
const COLORS = ["#8000FF", "#FFA500", "#FFD700"];

function AddBalanceModal({ isOpen, onClose, onAdd }) {
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    const num = parseFloat(amount);
    if (!isNaN(num) && num > 0) {
      onAdd(num);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} className="modal" overlayClassName="overlay">
      <h2>Add Balance</h2>
      <input
        type="number"
        placeholder="Income Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="modal-actions">
        <button className="btn yellow" onClick={handleAdd}>
          Add Balance
        </button>
        <button className="btn grey" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}

function AddExpenseModal({ isOpen, onClose, onAdd, balance }) {
  const [data, setData] = useState({ title: "", amount: "", category: "" });
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
    if (!data.title || !data.amount || !data.category) {
      enqueueSnackbar("All fields are required", { variant: "warning" });
      return;
    }

    const amount = parseFloat(data.amount);
    if (amount > balance) {
      enqueueSnackbar("Insufficient balance", { variant: "error" });
      return;
    }

    onAdd({ ...data, amount });
    setData({ title: "", amount: "", category: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} className="modal" overlayClassName="overlay">
      <h2>Add Expense</h2>
      <input
        placeholder="Title"
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
      />
      <input
        type="number"
        placeholder="Amount"
        value={data.amount}
        onChange={(e) => setData({ ...data, amount: e.target.value })}
      />
      <select
        value={data.category}
        onChange={(e) => setData({ ...data, category: e.target.value })}
      >
        <option value="">Select Category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div className="modal-actions">
        <button className="btn red" onClick={handleSubmit}>
          Add Expense
        </button>
        <button className="btn grey" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}

function EditExpenseModal({ isOpen, onClose, onEdit, original, balance }) {
  const [data, setData] = useState({ ...original });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setData({ ...original });
  }, [original]);

  const handleUpdate = () => {
    if (!data.title || !data.amount || !data.category) {
      enqueueSnackbar("All fields are required", { variant: "warning" });
      return;
    }

    const newAmount = parseFloat(data.amount);
    const available = balance + original.amount;

    if (newAmount > available) {
      enqueueSnackbar("Insufficient balance", { variant: "error" });
      return;
    }

    onEdit({ ...data, amount: newAmount });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} className="modal" overlayClassName="overlay">
      <h2>Edit Expense</h2>
      <input
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
      />
      <input
        type="number"
        value={data.amount}
        onChange={(e) => setData({ ...data, amount: e.target.value })}
      />
      <select
        value={data.category}
        onChange={(e) => setData({ ...data, category: e.target.value })}
      >
        <option value="">Select Category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div className="modal-actions">
        <button className="btn yellow" onClick={handleUpdate}>
          Update
        </button>
        <button className="btn grey" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}

function App() {
  const [balance, setBalance] = useState(() => +localStorage.getItem("balance") || 5000);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem("expenses")) || []);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    localStorage.setItem("balance", balance);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [balance, expenses]);

  const handleAddBalance = (amount) => setBalance(balance + amount);

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
    setBalance(balance - expense.amount);
  };

  const handleEditExpense = (updated) => {
    setExpenses((prev) => prev.map((exp) => (exp.id === updated.id ? updated : exp)));
    const oldAmount = expenses.find((e) => e.id === updated.id).amount;
    const diff = updated.amount - oldAmount;
    setBalance((prev) => prev - diff);
  };

  const chartData = CATEGORIES.map((cat) => ({
    name: cat,
    value: expenses.filter((e) => e.category === cat).reduce((a, b) => a + b.amount, 0),
  }));

  return (
    <SnackbarProvider>
      <div className="app">
        <h1>Expense Tracker</h1>
        <div className="card-container">
          <div className="card">
            <h2>Wallet Balance: <span className="green">₹{balance}</span></h2>
            <button className="btn green" onClick={() => setShowAddIncome(true)}>+ Add Income</button>
          </div>
          <div className="card">
            <h2>Expenses: <span className="yellow">₹{expenses.reduce((a, b) => a + b.amount, 0)}</span></h2>
            <button className="btn red" onClick={() => setShowAddExpense(true)}>+ Add Expense</button>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-box">
            <h3>Expense Summary</h3>
            <PieChart width={250} height={200}>
              <Pie data={chartData} dataKey="value" outerRadius={80} label>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </div>

          <div className="chart-box">
            <h3>Top Expenses</h3>
            <ResponsiveContainer width={300} height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="history">
          <h2>Recent Transactions</h2>
          {expenses.length === 0 ? (
            <p>No transactions!</p>
          ) : (
            <ul>
              {expenses.map((e) => (
                <li key={e.id}>
                  <span>{e.title} - ₹{e.amount} [{e.category}]</span>
                  <div className="btn-group">
                    <button className="icon-btn" onClick={() => {
                      setExpenses(expenses.filter((x) => x.id !== e.id));
                      setBalance(balance + e.amount);
                    }}>
                      <FaTrash />
                    </button>
                    <button className="icon-btn" onClick={() => setEditData(e)}>✏️</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <AddBalanceModal isOpen={showAddIncome} onClose={() => setShowAddIncome(false)} onAdd={handleAddBalance} />
        <AddExpenseModal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} onAdd={handleAddExpense} balance={balance} />
        {editData && (
          <EditExpenseModal
            isOpen={!!editData}
            original={editData}
            onEdit={handleEditExpense}
            onClose={() => setEditData(null)}
            balance={balance}
          />
        )}
      </div>
    </SnackbarProvider>
  );
}

export default App;
