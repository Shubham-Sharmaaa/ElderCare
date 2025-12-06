// server/models/Hospital.js
import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: String,
    email: { type: String, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Hospital", hospitalSchema);
