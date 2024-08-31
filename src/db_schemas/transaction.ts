import mongoose from "mongoose";
import { Transaction } from "../types";

// Schema for User Documents
const transactionSchema = new mongoose.Schema<Transaction>(
  {
    id: { type: String, required: true, unique: true },
    userID: { type: String, required: true },
    type: { type: String, required: false, default: "" },
    category: { type: String, required: false, default: "" },
    description: { type: String, required: false, default: "" },
    date: { type: Date, required: false, default: new Date() },
    paymethod: { type: String, required: false, default: "" },
    amount: { type: Number, required: false, default: 0 },
    currency: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models?.Transaction ??
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
