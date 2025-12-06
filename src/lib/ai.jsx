// // src/lib/ai.js
// import { apiAi } from "./fakeApi";

// // ---- Deterministic rules
// function rulesEngine(profile) {
//   const issues = [];
//   const recs = [];

//   // latest vitals
//   const last = (profile.lastVitals || profile.vitals || []).slice(-1)[0];
//   if (last) {
//     const { hr, spo2, sys, dia } = last;

//     if (spo2 <= 90) {
//       issues.push("Low SpO₂ (≤90%)");
//       recs.push(
//         "Immediate pulse-ox recheck; ensure proper sensor placement; consider ER if persistent."
//       );
//     } else if (spo2 <= 94) {
//       issues.push("Borderline SpO₂ (91–94%)");
//       recs.push(
//         "Breathing exercises; monitor every 2 hrs; consult physician if symptoms present."
//       );
//     }

//     if (sys >= 140 || dia >= 90) {
//       issues.push("Hypertensive reading");
//       recs.push(
//         "Rest 5–10 min and remeasure; reduce sodium; discuss meds adjustment with doctor."
//       );
//     } else if (sys < 90) {
//       issues.push("Possible hypotension");
//       recs.push(
//         "Hydrate; sit/lie down; review antihypertensives with doctor if frequent."
//       );
//     }

//     if (hr >= 100) {
//       issues.push("Tachycardia (HR ≥100)");
//       recs.push(
//         "Check fever/anxiety/caffeine; if persistent with symptoms, seek care."
//       );
//     } else if (hr <= 50) {
//       issues.push("Bradycardia (HR ≤50)");
//       recs.push("If dizzy/fainting, urgent evaluation; otherwise monitor.");
//     }
//   }

//   // condition keywords across ALL conditions (including custom)
//   const conditionText = [
//     ...(Array.isArray(profile.conditions) ? profile.conditions : []),
//     profile.condition || "",
//   ]
//     .join(" ")
//     .toLowerCase();

//   if (conditionText.includes("diabet")) {
//     recs.push(
//       "Keep consistent carb intake; 20–30 min walk daily; maintain SMBG log."
//     );
//   }
//   if (conditionText.includes("hypert")) {
//     recs.push(
//       "DASH-style diet; limit salt <5g/day; 150 min/week moderate activity."
//     );
//   }
//   // add more simple keyword checks here as needed:
//   // if (conditionText.includes("copd")) { ... }
//   // if (conditionText.includes("ckd"))  { ... }

//   // toy risk
//   let risk = 0;
//   risk += issues.length * 2;
//   risk += profile.age > 70 ? 1 : 0;
//   if (!profile.meds || profile.meds.length === 0) risk += 1;

//   const riskBand = risk >= 5 ? "High" : risk >= 3 ? "Moderate" : "Low";
//   return { issues, recs, risk, riskBand };
// }

// // ---- Server-backed LLM call
// async function llmRefine(profile, rules) {
//   try {
//     // const res = await fetch("/api/ai-remedies", {
//     //   method: "POST",
//     //   headers: { "Content-Type": "application/json" },
//     //   body: JSON.stringify({ profile, rules }),
//     // });
//     // if (!res.ok) throw new Error("AI server error");
//     // return await res.json(); // { rationale, plan[] }
//     // inside llmRefine(...)
//     const res = await fetch("/api/ai-remedies", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ profile, rules }),
//     });
//     if (!res.ok) throw new Error("AI server error");
//     const data = await res.json();
//     return data; // { rationale, plan }
//   } catch (e) {
//     // graceful fallback: still show something
//     return {
//       rationale: "LLM unavailable — showing rule-based plan.",
//       plan: rules.recs.slice(0, 6),
//     };
//   }
// }

// export async function getAiRemedies(elderId) {
//   const profile =
//     (apiAi.profile && apiAi.profile(elderId)) ||
//     (apiAi.buildPatientProfile && apiAi.buildPatientProfile(elderId));
//   if (!profile) throw new Error("No profile found");

//   // Normalize multiple conditions for rules + LLM
//   const conditions = Array.isArray(profile.conditions)
//     ? profile.conditions
//     : profile.condition
//     ? [profile.condition]
//     : [];
//   profile.conditions = conditions;
//   profile.condition = conditions.join(", "); // keep a string too for legacy UI

//   // Normalize vitals field
//   profile.vitals = profile.lastVitals || profile.vitals || [];

//   const rules = rulesEngine(profile);
//   const llm = await llmRefine(profile, rules);
//   return { profile, rules, llm };
// }

import { apiAi } from "./fakeApi";

// ---- Deterministic rules
function rulesEngine(profile) {
  const issues = [];
  const recs = [];

  // latest vitals
  const last = (profile.lastVitals || profile.vitals || []).slice(-1)[0];
  if (last) {
    const { hr, spo2, sys, dia } = last;

    if (spo2 <= 90) {
      issues.push("Low SpO₂ (≤90%)");
      recs.push(
        "Immediate pulse-ox recheck; ensure proper sensor placement; consider ER if persistent."
      );
    } else if (spo2 <= 94) {
      issues.push("Borderline SpO₂ (91–94%)");
      recs.push(
        "Breathing exercises; monitor every 2 hrs; consult physician if symptoms present."
      );
    }

    if (sys >= 140 || dia >= 90) {
      issues.push("Hypertensive reading");
      recs.push(
        "Rest 5–10 min and remeasure; reduce sodium; discuss meds adjustment with doctor."
      );
    } else if (sys < 90) {
      issues.push("Possible hypotension");
      recs.push(
        "Hydrate; sit/lie down; review antihypertensives with doctor if frequent."
      );
    }

    if (hr >= 100) {
      issues.push("Tachycardia (HR ≥100)");
      recs.push(
        "Check fever/anxiety/caffeine; if persistent with symptoms, seek care."
      );
    } else if (hr <= 50) {
      issues.push("Bradycardia (HR ≤50)");
      recs.push("If dizzy/fainting, urgent evaluation; otherwise monitor.");
    }
  }

  // condition keywords across ALL conditions (including custom)
  const conditionText = [
    ...(Array.isArray(profile.conditions) ? profile.conditions : []),
    profile.condition || "",
  ]
    .join(" ")
    .toLowerCase();

  if (conditionText.includes("diabet")) {
    recs.push(
      "Keep consistent carb intake; 20–30 min walk daily; maintain SMBG log."
    );
  }

  if (conditionText.includes("hypert")) {
    recs.push(
      "DASH-style diet; limit salt <5g/day; 150 min/week moderate activity."
    );
  }

  // toy risk
  let risk = 0;
  risk += issues.length * 2;
  risk += profile.age > 70 ? 1 : 0;
  if (!profile.meds || profile.meds.length === 0) risk += 1;

  const riskBand = risk >= 5 ? "High" : risk >= 3 ? "Moderate" : "Low";

  return { issues, recs, risk, riskBand };
}

// ---- Server-backed LLM call
async function llmRefine(profile, rules) {
  try {
    const res = await fetch("/api/ai-remedies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, rules }),
    });

    if (!res.ok) throw new Error("AI server error");

    const data = await res.json();
    return data; // { rationale, plan }
  } catch (e) {
    return {
      rationale: "LLM unavailable — showing rule-based plan.",
      plan: rules.recs.slice(0, 6),
    };
  }
}

export async function getAiRemedies(elderId) {
  const profile =
    (await (apiAi.profile && apiAi.profile(elderId))) ||
    (apiAi.buildPatientProfile && apiAi.buildPatientProfile(elderId));
  console.log("Profile fetched in getAiRemedies:", profile);
  if (!profile) throw new Error("No profile found");

  // Normalize conditions
  const conditions = Array.isArray(profile.conditions)
    ? profile.conditions
    : profile.condition
    ? [profile.condition]
    : [];

  profile.conditions = conditions;
  profile.condition = conditions.join(", "); // for legacy UI

  // Normalize vitals
  profile.vitals = profile.lastVitals || profile.vitals || [];

  const rules = rulesEngine(profile);
  const llm = await llmRefine(profile, rules);

  return { profile, rules, llm };
}
