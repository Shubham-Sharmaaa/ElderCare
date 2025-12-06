// server/routes/elders.routes.js
import { Router } from "express";
import Elder from "../models/Elder.js";

const r = Router();

r.get("/", async (req, res) => {
  try {
    const { ownerId, doctorId, hospitalId, elderId } = req.query;
    const q = {};
    console.log("Query params:", req.query);
    if (ownerId) q.ownerId = ownerId;
    if (doctorId) q.doctorId = doctorId;
    if (hospitalId) q.hospitalId = hospitalId;
    if (elderId) {
      q._id = elderId;
      const elder = await Elder.findOne(q).lean();
      if (!elder) return res.status(404).json({ error: "not_found" });
      return res.json(elder);
    }

    const rows = await Elder.find(q).sort({ createdAt: -1 }).lean();
    console.log("Fetched elders:", rows);
    res.json(rows);
  } catch (e) {
    console.error("GET /api/elders failed", e);
    res.status(500).json({ error: "server" });
  }
});

// // GET /api/elders?ownerId=xxx
// r.get("/", async (req, res) => {
//   try {
//     const { ownerId } = req.query;
//     const q = ownerId ? { ownerId } : {};
//     const rows = await Elder.find(q).sort({ createdAt: -1 }).lean();
//     res.json(rows);
//   } catch (e) {
//     console.error("GET /api/elders failed", e);
//     res.status(500).json({ error: "server" });
//   }
// });

// OPTIONAL: GET /api/elders/:id (for debugging)
// r.get("/:id", async (req, res) => {
//   try {
//     const doc = await Elder.findById(req.params.id).lean();
//     if (!doc) return res.status(404).json({ error: "not_found" });
//     res.json(doc);
//   } catch (e) {
//     console.error("GET /api/elders/:id failed", e);
//     res.status(400).json({ error: "bad_request" });
//   }
// });

// POST /api/elders  (called from fakeApi.create)
r.post("/", async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.ownerId || !b.hospitalId) {
      return res.status(400).json({ error: "ownerId and hospitalId required" });
    }

    // 💡 use frontend id if provided
    const id = b._id || Math.random().toString(36).slice(2, 10);

    const doc = await Elder.create({
      _id: id,
      ownerId: b.ownerId,
      name: b.name,
      age: b.age,
      conditions: Array.isArray(b.conditions) ? b.conditions : [],
      notes: b.notes || "",
      hospitalId: b.hospitalId,
      doctorId: b.doctorId || null,
    });

    res.status(201).json(doc);
  } catch (e) {
    console.error("POST /api/elders failed", e);
    res.status(400).json({ error: "bad_request" });
  }
});

// PUT /api/elders/:id  (called from fakeApi.update)
r.put("/:id", async (req, res) => {
  try {
    console.log("PUT /api/elders/:id", req.params.id, req.body); // 👀 debug

    const patch = req.body || {};
    const update = {};

    if (patch.name !== undefined) update.name = patch.name;
    if (patch.age !== undefined) update.age = patch.age;
    if (patch.conditions !== undefined) update.conditions = patch.conditions;
    if (patch.notes !== undefined) update.notes = patch.notes;
    if (patch.hospitalId !== undefined) update.hospitalId = patch.hospitalId;
    if (patch.doctorId !== undefined) update.doctorId = patch.doctorId;

    const doc = await Elder.findByIdAndUpdate(req.params.id, update, {
      new: true,
    }).lean();

    if (!doc) return res.status(404).json({ error: "not_found" });
    res.json(doc);
  } catch (e) {
    console.error("PUT /api/elders/:id failed", e);
    res.status(400).json({ error: "bad_request" });
  }
});

export default r;
