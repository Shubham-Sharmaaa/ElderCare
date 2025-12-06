// server/routes/reports.routes.js
import { Router } from "express";
import Report from "../models/Report.js";
import Elder from "../models/Elder.js";

const r = Router();

// GET /api/elders/:elderId/reports
r.get("/elders/:elderId/reports", async (req, res) => {
  try {
    const { elderId } = req.params;
    const rows = await Report.find({ elderId }).sort({ tsISO: 1 }).lean();
    res.json(rows);
  } catch (e) {
    console.error("GET /elders/:elderId/reports failed:", e);
    res.status(500).json({ error: "server_error" });
  }
});

// GET /api/hospitals/:hospitalId/reports  (for hospital dashboard)
r.get("/hospitals/:hospitalId/reports", async (req, res) => {
  try {
    const { hospitalId } = req.params;
    // find all elders for that hospital, then their reports
    const elders = await Elder.find({ hospitalId }).select("_id").lean();
    const ids = elders.map((e) => e._id);
    const rows = await Report.find({ elderId: { $in: ids } })
      .sort({ tsISO: 1 })
      .lean();
    res.json(rows);
  } catch (e) {
    console.error("GET /hospitals/:hospitalId/reports failed:", e);
    res.status(500).json({ error: "server_error" });
  }
});

// POST /api/elders/:elderId/reports  (doctor uploads)
r.post("/elders/:elderId/reports", async (req, res) => {
  try {
    const { elderId } = req.params;
    const { title, url, status, tsISO, _id } = req.body || {};
    if (!title || !url) {
      return res.status(400).json({ error: "title_and_url_required" });
    }

    const id = _id || Math.random().toString(36).slice(2, 10);

    const doc = await Report.create({
      _id: id,
      elderId,
      title,
      url,
      status: status || "pending",
      tsISO: tsISO || new Date().toISOString(),
    });

    res.status(201).json(doc);
  } catch (e) {
    console.error("POST /elders/:elderId/reports failed:", e);
    res.status(400).json({ error: "bad_request" });
  }
});

// PUT /api/reports/:id/status   (hospital/doctor approves/rejects)
r.put("/reports/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "invalid_status" });
    }

    const doc = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!doc) return res.status(404).json({ error: "not_found" });
    res.json(doc);
  } catch (e) {
    console.error("PUT /reports/:id/status failed:", e);
    res.status(400).json({ error: "bad_request" });
  }
});

export default r;
