// server/routes/elders.routes.js
import { Router } from "express";
import Doctor from "../models/Doctor.js";

const r = Router();

r.get("/", async (req, res) => {
  try {
    console.log("Query params(doctors):", req.query);
    const doctorId = req.query.doctorId;
    const q = {};
    if (doctorId) {
      q._id = doctorId;
      const doctor = await Doctor.findOne(q).lean();
      if (!doctor) return res.status(404).json({ error: "not_found" });
      return res.json(doctor);
    }
    return res.status(400).json({ error: "doctorId required" });
  } catch (e) {
    console.error("GET /api/doctors failed:", e);
    res.status(500).json({ error: "server" });
  }
});

export default r;
