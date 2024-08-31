import mongoose from "mongoose";
import { User } from "../types";

// Schema for User Documents
const userSchema = new mongoose.Schema<User>(
  {
    id: { type: String, required: false },
    username: { type: String, required: false },
    password: { type: String, required: false },
    roles: {
      User: {
        type: Number,
        default: 2001,
      },
      Editor: Number,
      Admin: Number,
    },
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false },

    firstname: { type: String, required: false, default: "" },
    lastname: { type: String, required: false, default: "" },
    email: { type: String, required: false, default: "" },

    theme: { type: String, required: false },
    descriptions: [{ type: Object, required: false }],

    active: { type: Boolean, required: false },
    lastSigin: { type: Date, required: false },
  },
  { timestamps: true }
);

const user = mongoose.models?.User ?? mongoose.model("User", userSchema);

export default user;
