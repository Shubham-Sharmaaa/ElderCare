// server/models/Doctor.js
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: String,
    email: String,
    hospitalId: String, // references Hospital._id (string)
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
