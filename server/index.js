// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import fetch from "node-fetch";
// import { OpenAI } from "openai";

// import { connectDB } from "./config/db.js";
// import eldersRouter from "./routes/elders.routes.js";
// import createVitalsRouter from "./routes/vitals.routes.js"; // name is 'r', default export
// // mongodb+srv://ssharma53be23_db_user:Shubha321@eldercare.fbltfgy.mongodb.net/

// const app = express();
// app.use(express.json());
// app.use(cors());
// // REST API (Mongo)
// app.use("/api/elders", eldersRouter);
// app.use(
//   "/api/elders/:id/vitals",
//   (req, res, next) => next(),
//   createVitalsRouter
// );

// // Detect which backend to use
// const HAS_OPENAI = !!process.env.OPENAI_API_KEY;
// const OLLAMA_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
// const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral:7b";

// const openai = HAS_OPENAI
//   ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
//   : null;

// app.post("/api/ai-remedies", async (req, res) => {
//   try {
//     const { profile, rules } = req.body || {};
//     if (!profile) return res.status(400).json({ error: "Missing profile" });

//     // Build one clean prompt (kept identical across backends)
//     const prompt = [
//       "You are a clinical assistant. Produce EXACTLY 5 concise bullet points for a care plan.",
//       "• Each point must start with '- ' and be under 20 words.",
//       "• The last bullet must describe escalation criteria (when to call the doctor or emergency).",
//       "",
//       "Patient profile:",
//       JSON.stringify(
//         {
//           name: profile.name,
//           age: profile.age,
//           conditions: profile.conditions,
//           meds: profile.meds,
//           lastVitals: profile.vitals?.slice(-1)[0],
//         },
//         null,
//         2
//       ),
//       "",
//       "Rules engine output:",
//       JSON.stringify(rules, null, 2),
//     ].join("\n");

//     let text = "";

//     if (HAS_OPENAI) {
//       // OpenAI path (in case you re-enable billing later)
//       const completion = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         temperature: 0.2,
//         messages: [{ role: "user", content: prompt }],
//       });
//       text = completion.choices?.[0]?.message?.content?.trim() || "";
//     } else {
//       // OLLAMA path (free, local)
//       // Non-streaming:
//       const resp = await fetch(`${OLLAMA_URL}/api/generate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           model: OLLAMA_MODEL,
//           prompt,
//           temperature: 0.2,
//           stream: false,
//         }),
//       });
//       if (!resp.ok) {
//         const errText = await resp.text();
//         throw new Error(`Ollama error: ${resp.status} ${errText}`);
//       }
//       const data = await resp.json(); // { response: "...", done: true, ... }
//       text = (data.response || "").trim();
//     }

//     // Convert to a list (bullets or numbered)
//     const plan =
//       text
//         .split("\n")
//         .map((l) => l.replace(/^[\-\*\d\.\)\s]+/, "").trim())
//         .filter(Boolean) || [];

//     res.json({
//       rationale: HAS_OPENAI
//         ? "LLM plan (OpenAI)"
//         : `LLM plan (Ollama: ${OLLAMA_MODEL})`,
//       plan: plan.length ? plan : [text || "No response generated."],
//     });
//   } catch (err) {
//     console.error("[AI] error:", err);
//     // Graceful fallback so your UI still works
//     res.status(200).json({
//       rationale: "LLM unavailable — showing rule-based plan.",
//       plan: (req.body?.rules?.recs || []).slice(0, 6),
//     });
//   }
// });
// app.get("/health", (req, res) => {
//   const HAS_OPENAI = !!process.env.OPENAI_API_KEY;
//   const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral:7b";
//   res.json({
//     ok: true,
//     provider: HAS_OPENAI ? "openai" : `ollama:${OLLAMA_MODEL}`,
//   });
// });
// const PORT = process.env.PORT || 5174;

// connectDB(process.env.MONGO_URI)
//   .then(() => app.listen(PORT, () => console.log(`[API] running on :${PORT}`)))
//   .catch((e) => {
//     console.error("[DB] failed to connect", e);
//     process.exit(1);
//   });
// app.listen(PORT, () => console.log(`[API] AI server running on :${PORT}`));

// server/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { OpenAI } from "openai";

import { connectDB } from "./config/db.js";
import eldersRouter from "./routes/elders.routes.js";
import vitalsRouter from "./routes/vitals.routes.js";
import deviceRouter from "./routes/device.routes.js";
import devicesAdminRouter from "./routes/devicesAdmin.routes.js";
import authRouter from "./routes/auth.routes.js";
import hospitalsRouter from "./routes/hospital.routes.js";
import doctorRouter from "./routes/doctor.routes.js";
import reportsRouter from "./routes/reports.routes.js";
import notesRouter from "./routes/notes.routes.js";

const app = express();
app.use(express.json());
app.use(cors());
// app.use((req, res, next) => {
//   console.log(req);
//   next();
// });
// REST API
app.use("/api/elders", eldersRouter);
app.use("/api/elders/:id/vitals", (req, res, next) => next(), vitalsRouter);
app.use("/api/device", deviceRouter);
app.use("/api/devices", devicesAdminRouter);
app.use("/api/auth", authRouter);
app.use("/api/hospitals", hospitalsRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api", reportsRouter);
app.use("/api", notesRouter);

// ---- AI remedies route (your existing logic) ----
const HAS_OPENAI = !!process.env.OPENAI_API_KEY;
const OLLAMA_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral:7b";

const openai = HAS_OPENAI
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.post("/api/ai-remedies", async (req, res) => {
  try {
    const { profile, rules } = req.body || {};
    if (!profile) return res.status(400).json({ error: "Missing profile" });

    const prompt = [
      "You are a clinical assistant. Produce EXACTLY 5 concise bullet points for a care plan.",
      "• Each point must start with '- ' and be under 20 words.",
      "• The last bullet must describe escalation criteria (when to call the doctor or emergency).",
      "",
      "Patient profile:",
      JSON.stringify(
        {
          name: profile.name,
          age: profile.age,
          conditions: profile.conditions,
          meds: profile.meds,
          lastVitals: profile.vitals?.slice(-1)[0],
        },
        null,
        2
      ),
      "",
      "Rules engine output:",
      JSON.stringify(rules, null, 2),
    ].join("\n");

    let text = "";

    if (HAS_OPENAI) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
      });
      text = completion.choices?.[0]?.message?.content?.trim() || "";
    } else {
      const resp = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          temperature: 0.2,
          stream: false,
        }),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Ollama error: ${resp.status} ${errText}`);
      }
      const data = await resp.json();
      text = (data.response || "").trim();
    }

    const plan =
      text
        .split("\n")
        .map((l) => l.replace(/^[\-\*\d\.\)\s]+/, "").trim())
        .filter(Boolean) || [];

    res.json({
      rationale: HAS_OPENAI
        ? "LLM plan (OpenAI)"
        : `LLM plan (Ollama: ${OLLAMA_MODEL})`,
      plan: plan.length ? plan : [text || "No response generated."],
    });
  } catch (err) {
    console.error("[AI] error:", err);
    res.status(200).json({
      rationale: "LLM unavailable — showing rule-based plan.",
      plan: (req.body?.rules?.recs || []).slice(0, 6),
    });
  }
});

// health check
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    provider: HAS_OPENAI ? "openai" : `ollama:${OLLAMA_MODEL}`,
  });
});

const PORT = process.env.PORT || 5174;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`[API] running on :${PORT}`));
});
