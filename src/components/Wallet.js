import React from "react";

const Wallet = ({ balance, setBalance }) => {
  return (
    <div className="wallet">
      <h2>Wallet Balance: ₹{balance}</h2>
    </div>
  );
};

export default Wallet;