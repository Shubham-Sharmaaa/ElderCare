import Elder from "../models/Elder.js";

export async function createElder(req, res) {
  try {
    const doc = await Elder.create(req.body);
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function listByOwner(req, res) {
  const { ownerId } = req.query;
  const list = await Elder.find({ ownerId });
  res.json(list);
}

export async function updateElder(req, res) {
  const doc = await Elder.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(doc);
}
