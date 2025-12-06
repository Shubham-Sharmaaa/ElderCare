// import mongoose from "mongoose";

// const vitalSchema = new mongoose.Schema(
//   {
//     _id: { type: String }, // uid()
//     elderId: String,
//     tsISO: String, // for UI / charts (unchanged)
//     ts: {
//       // for TTL (Date type)
//       type: Date,
//       default: () => new Date(),
//       index: { expires: 600 }, // ❗ 600 seconds = 10 minutes
//     },
//     hr: Number,
//     spo2: Number,
//     sys: Number,
//     dia: Number,
//     source: String,
//     deviceId: String,
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Vital", vitalSchema);

// server/models/Vital.js
import mongoose from "mongoose";

const vitalSchema = new mongoose.Schema(
  {
    _id: { type: String }, // use your uid() string IDs
    elderId: { type: String, index: true }, // string reference to Elder._id
    tsISO: String, // original ISO string for UI compatibility
    ts: {
      // Date used for TTL and queries
      type: Date,
      default: () => new Date(),
      index: { expires: 600 }, // TTL: 600 seconds = 10 minutes
    },
    hr: Number,
    spo2: Number,
    sys: Number,
    dia: Number,
    source: { type: String, default: "sim" }, // "sim" | "device"
    deviceId: String,
  },
  { timestamps: true }
);

// ensure indexes exist (mongoose will create on startup unless disabled)
vitalSchema.index({ elderId: 1, ts: -1 });

export default mongoose.model("Vital", vitalSchema);
