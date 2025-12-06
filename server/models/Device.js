// server/models/Device.js
import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    _id: { type: String }, // deviceId that Arduino will send
    elderId: String, // which elder this device belongs to
    label: String,
    lastSeenISO: String,
  },
  { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);
