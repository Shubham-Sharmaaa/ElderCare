// server/models/Note.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    _id: { type: String }, // match frontend uid()
    elderId: { type: String, required: true },
    doctorId: { type: String },
    text: String,
    tsISO: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
