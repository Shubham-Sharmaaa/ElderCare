// server/models/Elder.js
import mongoose from "mongoose";

const elderSchema = new mongoose.Schema(
  {
    _id: { type: String }, // 💡 same string id as fakeApi.uid()
    ownerId: String,
    name: String,
    age: Number,
    conditions: { type: [String], default: [] },
    notes: String,
    hospitalId: String,
    doctorId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Elder", elderSchema);
