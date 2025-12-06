// server/routes/hospitals.routes.js
import { Router } from "express";
import Hospital from "../models/Hospital.js";
import Doctor from "../models/Doctor.js";

const r = Router();

// GET /api/hospitals
r.get("/", async (req, res) => {
  try {
    const { hospitalId } = req.query;
    if (hospitalId) {
      const doc = await Hospital.findById(hospitalId).lean();
      if (!doc) return res.status(404).json({ error: "not_found" });
      return res.json(doc);
    }
    const rows = await Hospital.find().sort({ name: 1 }).lean();
    res.json(rows);
  } catch (e) {
    console.error("GET /api/hospitals failed:", e);
    res.status(500).json({ error: "server" });
  }
});

// POST /api/hospitals
// { _id, name, email }
r.post("/", async (req, res) => {
  try {
    const { _id, name, email } = req.body || {};
    if (!_id || !name) {
      return res.status(400).json({ error: "missing_fields" });
    }
    const doc = await Hospital.create({
      _id,
      name,
      email: email || `${name.split(" ")[0].toLowerCase()}@hospital.demo`,
    });
    res.status(201).json(doc);
  } catch (e) {
    console.error("POST /api/hospitals failed:", e);
    res.status(400).json({ error: "bad_request" });
  }
});

// GET /api/hospitals/:id/doctors
r.get("/:id/doctors", async (req, res) => {
  try {
    const rows = await Doctor.find({ hospitalId: req.params.id })
      .sort({ name: 1 })
      .lean();
    res.json(rows);
  } catch (e) {
    console.error("GET /api/hospitals/:id/doctors failed:", e);
    res.status(500).json({ error: "server" });
  }
});

// POST /api/hospitals/:id/doctors
// body: { _id, name, email }
r.post("/:id/doctors", async (req, res) => {
  try {
    const hospitalId = req.params.id;
    const { _id, name, email } = req.body || {};
    if (!_id || !name || !email) {
      return res.status(400).json({ error: "missing_fields" });
    }
    const doc = await Doctor.create({
      _id,
      name,
      email,
      hospitalId,
    });
    res.status(201).json(doc);
  } catch (e) {
    console.error("POST /api/hospitals/:id/doctors failed:", e);
    res.status(400).json({ error: "bad_request" });
  }
});

export default r;
