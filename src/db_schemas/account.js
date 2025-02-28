import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userID: { type: String, required: true },

    type: { type: String, required: false, default: "" }, // "Bank Card" | "Cash" | "Savings Account"
    name: { type: String, required: false, default: "" },
    currency: { type: String, required: false, default: "" },

    color: { type: String, required: false, default: "" },
    icon: { type: String, required: false, default: "" },
    imageUrl: { type: String, required: false, default: "" },

    bank: { type: String, required: false, default: "" },
    nameOnCard: { type: String, required: false, default: "" },
    expDate: { type: Date, required: false, default: new Date() },
    accountType: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

const Account =
  mongoose.models?.Account ?? mongoose.model("Account", accountSchema);

export default Account;
