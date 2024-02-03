const mongoose = require("mongoose");

// Schema for User Documents
const transactionSchema = new mongoose.Schema({
  id: { type: String, required: false },
  userID: { type: String, required: false },
  type: { type: String, required: false },
  category: { type: String, required: false },
  description: { type: String, required: false },
  date: { type: Date, required: false },
  paymethod: { type: String, required: false },
  amount: { type: Number, required: false },
  currency: { type: String, required: false },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
