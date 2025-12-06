// server/routes/notes.routes.js
import { Router } from "express";
import Note from "../models/Note.js";

const r = Router();

// GET /api/elders/:elderId/notes
r.get("/elders/:elderId/notes", async (req, res) => {
  try {
    const { elderId } = req.params;
    const rows = await Note.find({ elderId }).sort({ tsISO: 1 }).lean();
    res.json(rows);
  } catch (e) {
    console.error("GET /elders/:elderId/notes failed:", e);
    res.status(500).json({ error: "server_error" });
  }
});

// POST /api/elders/:elderId/notes
r.post("/elders/:elderId/notes", async (req, res) => {
  try {
    const { elderId } = req.params;
    const { doctorId, text, tsISO, _id } = req.body || {};
    if (!text) {
      return res.status(400).json({ error: "text_required" });
    }

    const id = _id || Math.random().toString(36).slice(2, 10);

    const doc = await Note.create({
      _id: id,
      elderId,
      doctorId: doctorId || null,
      text,
      tsISO: tsISO || new Date().toISOString(),
    });

    res.status(201).json(doc);
  } catch (e) {
    console.error("POST /elders/:elderId/notes failed:", e);
    res.status(400).json({ error: "bad_request" });
  }
});

export default r;
