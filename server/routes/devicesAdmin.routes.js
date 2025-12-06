// server/routes/devicesAdmin.routes.js
import { Router } from "express";
import Device from "../models/Device.js";

const r = Router();

// POST /api/devices
// { id, elderId, label }
r.post("/", async (req, res) => {
  try {
    const { id, elderId, label } = req.body || {};
    if (!id || !elderId) {
      return res.status(400).json({ error: "id and elderId required" });
    }
    const dev = await Device.create({
      _id: id,
      elderId,
      label: label || "Demo device",
      lastSeenISO: null,
    });
    res.status(201).json(dev);
  } catch (e) {
    console.error("POST /api/devices failed:", e);
    res.status(400).json({ error: "bad_request" });
  }
});

export default r;
