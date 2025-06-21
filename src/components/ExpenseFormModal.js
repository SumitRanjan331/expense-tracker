import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useSnackbar } from "notistack";

const categories = ["Food", "Transport", "Health", "Shopping", "Other"];

const ExpenseFormModal = ({
  isOpen,
  onRequestClose,
  onSubmit,
  currentBalance,
  editData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  useEffect(() => {
    if (editData) setFormData(editData);
    else setFormData({ title: "", amount: "", category: "", date: "" });
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, amount, category, date } = formData;
    if (!title || !amount || !category || !date) {
      enqueueSnackbar("Please fill all fields", { variant: "warning" });
      return;
    }
    const amountNum = Number(amount);
    const isEditing = Boolean(editData);
    const oldAmount = isEditing ? editData.amount : 0;
    if (amountNum > currentBalance + (isEditing ? oldAmount : 0)) {
      enqueueSnackbar("Insufficient balance!", { variant: "error" });
      return;
    }
    onSubmit({ ...formData, amount: amountNum, id: editData?.id });
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
      <h2>{editData ? "Edit Expense" : "Add Expense"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
};

export default ExpenseFormModal;