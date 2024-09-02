import mongoose from "mongoose";

// Schema for User Documents
const descriptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    label: { type: String, required: false, default: "" },
    value: { type: String, required: false, default: "" },
    category: { type: String, required: false, default: "" },
    icon: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

const Description =
  mongoose.models?.Descrption ??
  mongoose.model("Description", descriptionSchema);

export default Description;
