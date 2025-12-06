import Vital from "../models/Vital.js";

export async function addVital(req, res) {
  try {
    const doc = await Vital.create({
      elderId: req.params.id,
      tsISO: new Date().toISOString(),
      ...req.body,
    });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function listVitals(req, res) {
  const rows = await Vital.find({ elderId: req.params.id }).sort({ tsISO: 1 });
  res.json(rows);
}
