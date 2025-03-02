import mongoose from "mongoose";

// Schema for User Documents
const transactionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userID: { type: String, required: true },

    type: { type: String, required: false, default: "" }, // income / expense / transfer

    category: { type: String, required: false, default: "" },
    description: { type: String, required: false, default: "" },
    descId: { type: String, ref: "Description", required: false },
    details: { type: String, required: false, default: "" },
    notes: { type: String, required: false, default: "" },

    date: { type: Date, required: false, default: new Date() },

    paymethod: { type: String, required: false, default: "" },
    accountId: { type: String, ref: "Account", required: false },

    amount: { type: Number, required: false, default: 0 },
    currency: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models?.Transaction ??
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
