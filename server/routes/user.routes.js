// server/routes/elders.routes.js
import { Router } from "express";
import User from "../models/User.js";

const r = Router();

r.get("/", async (req, res) => {
  try {
    const user = await User.find({ role: "nri" }).lean();
    if (!user) return res.status(404).json({ error: "not_found" });
    return res.json(user);
  } catch (e) {
    console.error("GET /api/user failed:", e);
    res.status(500).json({ error: "server" });
  }
});

export default r;
