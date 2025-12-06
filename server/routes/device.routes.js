// // server/routes/device.routes.js
// import { Router } from "express";
// import Device from "../models/Device.js";
// import Vital from "../models/Vital.js";

// const r = Router();

// /**
//  * POST /api/device/vitals
//  * Body: { deviceId, hr, spo2, sys, dia, tsISO? }
//  */
// r.post("/vitals", async (req, res) => {
//   try {
//     const { deviceId, hr, spo2, sys, dia, tsISO } = req.body || {};
//     if (!deviceId) return res.status(400).json({ error: "deviceId required" });

//     const dev = await Device.findById(deviceId).lean();
//     if (!dev || !dev.elderId) {
//       return res.status(404).json({ error: "device or elder not found" });
//     }

//     const timestamp = tsISO || new Date().toISOString();

//     const row = await Vital.create({
//       _id: Math.random().toString(36).slice(2, 10),
//       elderId: dev.elderId,
//       tsISO: timestamp,
//       ts: new Date(timestamp), // ← added
//       hr,
//       spo2,
//       sys,
//       dia,
//       source: "device",
//       deviceId,
//     });

//     await Device.updateOne({ _id: deviceId }, { lastSeenISO: timestamp });

//     res.status(201).json(row);
//   } catch (e) {
//     console.error("POST /api/device/vitals failed:", e);
//     res.status(400).json({ error: "bad_request" });
//   }
// });

// export default r;

// server/routes/device.routes.js
import { Router } from "express";
import Device from "../models/Device.js";
import Vital from "../models/Vital.js";

const r = Router();

/**
 * POST /api/device/vitals
 * Body: { deviceId, hr, spo2, sys, dia, tsISO? }
 */
r.post("/vitals", async (req, res) => {
  try {
    const { deviceId, hr, spo2, sys, dia, tsISO } = req.body || {};
    if (!deviceId) return res.status(400).json({ error: "deviceId required" });

    const dev = await Device.findById(deviceId).lean();
    if (!dev || !dev.elderId) {
      return res.status(404).json({ error: "device or elder not found" });
    }

    const timestampISO = tsISO || new Date().toISOString();
    const timestamp = new Date(timestampISO);

    const row = await Vital.create({
      _id: Math.random().toString(36).slice(2, 10),
      elderId: dev.elderId,
      tsISO: timestamp.toISOString(),
      ts: timestamp,
      hr: hr == null ? null : Number(hr),
      spo2: spo2 == null ? null : Number(spo2),
      sys: sys == null ? null : Number(sys),
      dia: dia == null ? null : Number(dia),
      source: "device",
      deviceId,
    });

    // update device lastSeen (non-blocking-ish)
    await Device.updateOne(
      { _id: deviceId },
      { lastSeenISO: timestamp.toISOString() }
    );

    res.status(201).json(row);
  } catch (e) {
    console.error("[API] POST /api/device/vitals failed:", e);
    res.status(400).json({ error: "bad_request" });
  }
});

export default r;
