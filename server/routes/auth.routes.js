// // server/routes/auth.routes.js
// import { Router } from "express";
// import User from "../models/User.js";

// const r = Router();

// // POST /api/auth/register-nri
// // body: { _id, name, email, password }
// r.post("/register-nri", async (req, res) => {
//   try {
//     const { _id, name, email, password } = req.body || {};
//     if (!_id || !email || !name) {
//       return res.status(400).json({ error: "missing_fields" });
//     }

//     const existing = await User.findOne({ email }).lean();
//     if (existing) {
//       return res.status(409).json({ error: "email_exists" });
//     }

//     const doc = await User.create({
//       _id,
//       role: "nri",
//       name,
//       email,
//       password: password || "",
//     });

//     res.status(201).json({
//       id: doc._id,
//       role: doc.role,
//       name: doc.name,
//       email: doc.email,
//     });
//   } catch (e) {
//     console.error("POST /api/auth/register-nri failed:", e);
//     res.status(400).json({ error: "bad_request" });
//   }
// });

// export default r;

// server/routes/auth.routes.js
import { Router } from "express";
import User from "../models/User.js";
import Hospital from "../models/Hospital.js";
import Doctor from "../models/Doctor.js";

const r = Router();

/**
 * POST /api/auth/login
 * Body: { email, password? }
 *
 * Rules (matching your fakeApi behaviour):
 * - NRI/Admin (User): password REQUIRED and must match
 * - Doctor/Hospital: password IGNORED (email-only login)
 */
r.post("/login", async (req, res) => {
  try {
    const { email, password = "" } = req.body || {};
    const e = (email || "").trim().toLowerCase();
    if (!e) return res.status(400).json({ error: "email_required" });

    // 1) NRI/Admin in Users collection
    const u = await User.findOne({ email: e }).lean();
    if (u) {
      if (!password) {
        return res.status(400).json({ error: "password_required" });
      }
      // for project we use plain text; in real life use bcrypt
      if (u.password && u.password !== password) {
        return res.status(401).json({ error: "invalid_credentials" });
      }
      return res.json({
        id: u._id,
        role: u.role,
        name: u.name,
        email: u.email,
      });
    }

    // 2) Doctor (email-only login)
    const doc = await Doctor.findOne({ email: e }).lean();
    if (doc) {
      // find hospital name for enrichment
      const hosp = await Hospital.findById(doc.hospitalId).lean();
      return res.json({
        id: doc._id,
        role: "doctor",
        name: doc.name,
        email: doc.email,
        hospitalId: doc.hospitalId,
        hospitalName: hosp?.name || "",
        doctorId: doc._id,
      });
    }

    // 3) Hospital (email-only login)
    const hosp = await Hospital.findOne({ email: e }).lean();
    if (hosp) {
      return res.json({
        id: hosp._id,
        role: "hospital",
        name: hosp.name,
        email: hosp.email,
        hospitalId: hosp._id,
      });
    }

    return res.status(404).json({ error: "account_not_found" });
  } catch (e) {
    console.error("POST /api/auth/login failed:", e);
    res.status(500).json({ error: "server_error" });
  }
});

/**
 * POST /api/auth/register-nri
 * Body: { _id, name, email, password }
 */
r.post("/register-nri", async (req, res) => {
  try {
    const { _id, name, email, password } = req.body || {};
    if (!_id || !email || !name) {
      return res.status(400).json({ error: "missing_fields" });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ error: "email_exists" });
    }

    const doc = await User.create({
      _id,
      role: "nri",
      name,
      email,
      password: password || "",
    });

    res.status(201).json({
      id: doc._id,
      role: doc.role,
      name: doc.name,
      email: doc.email,
    });
  } catch (e) {
    console.error("POST /api/auth/register-nri failed:", e);
    res.status(400).json({ error: "bad_request" });
  }
});

export default r;
