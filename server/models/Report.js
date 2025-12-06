// server/models/Report.js
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    _id: { type: String }, // match frontend uid()
    elderId: { type: String, required: true },
    title: String,
    url: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    tsISO: { type: String }, // keep as string for easy sorting in UI
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
