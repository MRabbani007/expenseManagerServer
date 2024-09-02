import mongoose from "mongoose";

// Schema for User Documents
const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    label: { type: String, required: false, default: "" },
    value: { type: String, required: false, default: "" },
    icon: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

const Category =
  mongoose.models?.Category ?? mongoose.model("Category", categorySchema);

export default Category;
