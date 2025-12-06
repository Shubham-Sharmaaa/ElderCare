// // server/routes/vitals.routes.js
// import { Router } from "express";
// import Vital from "../models/Vital.js";

// const r = Router({ mergeParams: true });

// // GET /api/elders/:id/vitals
// r.get("/", async (req, res) => {
//   try {
//     const elderId = req.params.id;
//     const rows = await Vital.find({ elderId }).sort({ tsISO: 1 }).lean();
//     res.json(rows);
//   } catch (e) {
//     console.error("GET vitals failed:", e);
//     res.status(500).json({ error: "server" });
//   }
// });

// // POST /api/elders/:id/vitals
// r.post("/", async (req, res) => {
//   try {
//     const elderId = req.params.id;
//     const { hr, spo2, sys, dia, tsISO, source, deviceId } = req.body || {};
//     const timestamp = tsISO || new Date().toISOString();

//     const row = await Vital.create({
//       _id: Math.random().toString(36).slice(2, 10),
//       elderId,
//       tsISO: timestamp,
//       ts: new Date(timestamp), // ← added
//       hr,
//       spo2,
//       sys,
//       dia,
//       source: source || "sim",
//       deviceId: deviceId || null,
//     });
//     res.status(201).json(row);
//   } catch (e) {
//     console.error("POST vitals failed:", e);
//     res.status(400).json({ error: "bad_request" });
//   }
// });

// export default r;

// server/routes/vitals.routes.js
import { Router } from "express";
import Vital from "../models/Vital.js";

const r = Router({ mergeParams: true });

// GET /api/elders/:id/vitals?limit=50&since=ISO_TIMESTAMP
r.get("/", async (req, res) => {
  try {
    const elderId = req.params.id;
    if (!elderId) return res.status(400).json({ error: "missing_elder_id" });

    const limit = Math.min(200, Math.max(1, Number(req.query.limit || 100)));
    const since = req.query.since ? new Date(req.query.since) : null;

    const q = { elderId };
    if (since && !isNaN(since.getTime())) q.ts = { $gte: since };

    const rows = await Vital.find(q).sort({ ts: 1 }).limit(limit).lean();
    res.json(rows);
  } catch (e) {
    console.error("[API] GET /api/elders/:id/vitals failed:", e);
    res.status(500).json({ error: "server" });
  }
});

// POST /api/elders/:id/vitals
r.post("/", async (req, res) => {
  try {
    const elderId = req.params.id;
    if (!elderId) return res.status(400).json({ error: "missing_elder_id" });

    const { hr, spo2, sys, dia, tsISO, source, deviceId } = req.body || {};

    // Basic validation: convert to numbers if possible
    const parsed = {
      hr: hr == null ? null : Number(hr),
      spo2: spo2 == null ? null : Number(spo2),
      sys: sys == null ? null : Number(sys),
      dia: dia == null ? null : Number(dia),
    };

    const timestampISO = tsISO || new Date().toISOString();
    const timestamp = new Date(timestampISO);

    const row = await Vital.create({
      _id: Math.random().toString(36).slice(2, 10),
      elderId,
      tsISO: timestamp.toISOString(),
      ts: timestamp,
      hr: parsed.hr,
      spo2: parsed.spo2,
      sys: parsed.sys,
      dia: parsed.dia,
      source: source || "sim",
      deviceId: deviceId || null,
    });

    res.status(201).json(row);
  } catch (e) {
    console.error("[API] POST /api/elders/:id/vitals failed:", e);
    res.status(400).json({ error: "bad_request" });
  }
});

export default r;
