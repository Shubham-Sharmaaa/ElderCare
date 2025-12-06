// server/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String }, // same as fakeApi uid()
    role: { type: String, enum: ["admin", "nri"], required: true },
    name: String,
    email: { type: String, unique: true },
    // For a project you can keep plain-text; in production this would be a hash
    password: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
