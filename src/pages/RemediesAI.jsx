// // src/pages/RemediesAI.jsx
// import React, { useState } from "react";
// import { usePatients } from "../context/PatientContext";
// import { getAiRemedies } from "../lib/ai";

// export default function RemediesAI() {
//   const { elders } = usePatients();
//   const [sel, setSel] = useState("");
//   const [out, setOut] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const run = async () => {
//     setErr("");
//     setOut(null);
//     setLoading(true);
//     try {
//       const res = await getAiRemedies(sel);
//       setOut(res);
//     } catch (e) {
//       setErr(e.message || "Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page">
//       <div className="card">
//         <h2>AI Remedies (Clinical Assistant)</h2>
//         <div style={{ display: "flex", gap: 12 }}>
//           <select
//             value={sel}
//             onChange={(e) => setSel(e.target.value)}
//             style={{ minWidth: 260 }}
//           >
//             <option value="">Select elder…</option>
//             {elders.map((e) => (
//               <option key={e.id} value={e.id}>
//                 {e.name} — {e.condition || "—"}
//               </option>
//             ))}
//           </select>
//           <button disabled={!sel || loading} onClick={run}>
//             {loading ? "Analyzing…" : "Generate Remedies"}
//           </button>
//         </div>
//         {err && <p className="error">{err}</p>}
//       </div>

//       {out && (
//         <>
//           <div className="card">
//             <h3>Patient Snapshot</h3>
//             <p>
//               <b>Name:</b> {out.profile.name} ({out.profile.age})
//             </p>
//             <p>
//               <b>Condition:</b> {out.profile.condition || "—"}
//             </p>
//             <p>
//               <b>Hospital/Doctor:</b> {out.profile.hospital || "—"} /{" "}
//               {out.profile.doctor || "—"}
//             </p>
//             <p>
//               <b>Current meds:</b> {out.profile.meds?.join(", ") || "—"}
//             </p>
//           </div>

//           <div className="card">
//             <h3>Rules Engine Assessment</h3>
//             <p>
//               <b>Risk:</b> {out.rules.riskBand} (score {out.rules.risk})
//             </p>
//             {out.rules.issues.length > 0 ? (
//               <>
//                 <p>
//                   <b>Red/Amber findings:</b>
//                 </p>
//                 <ul>
//                   {out.rules.issues.map((x, i) => (
//                     <li key={i}>{x}</li>
//                   ))}
//                 </ul>
//               </>
//             ) : (
//               <p>No red flags from latest vitals.</p>
//             )}
//             {out.rules.recs.length > 0 && (
//               <>
//                 <p>
//                   <b>Evidence-based suggestions:</b>
//                 </p>
//                 <ul>
//                   {out.rules.recs.map((x, i) => (
//                     <li key={i}>{x}</li>
//                   ))}
//                 </ul>
//               </>
//             )}
//           </div>

//           <div className="card">
//             <h3>LLM Care Plan</h3>
//             <p style={{ opacity: 0.7 }}>{out.llm.rationale}</p>
//             {Array.isArray(out.llm.plan) && out.llm.plan.length ? (
//               <ul>
//                 {out.llm.plan.map((x, i) => (
//                   <li key={i}>{x}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p>
//                 Connect an API key in <code>VITE_OPENAI_API_KEY</code> to enable
//                 refined plans.
//               </p>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
// src/pages/RemediesAI.jsx
import React, { useEffect, useState } from "react";
import { usePatients } from "../context/PatientContext";
import { getAiRemedies } from "../lib/ai";

function getConditionList(obj) {
  // Accepts elder or profile shape
  if (Array.isArray(obj?.conditions)) return obj.conditions.filter(Boolean);
  if (obj?.condition) return [obj.condition];
  return [];
}
function renderConditionBadges(list) {
  if (!list.length) return <span className="muted">—</span>;
  return (
    <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
      {list.map((c) => (
        <span key={c} className="badge">
          {c}
        </span>
      ))}
    </div>
  );
}

export default function RemediesAI() {
  const { elders } = usePatients();
  const [sel, setSel] = useState(elders[0]?._id || "");
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    if (elders.length > 0 && !sel) {
      setSel(elders[0]._id);
    }
  }, [elders, sel]);
  const run = async () => {
    setErr("");
    setOut(null);
    setLoading(true);
    try {
      const res = await getAiRemedies(elders[0]?._id);
      setOut(res);
    } catch (e) {
      console.log("error in RemediesAI run: ", e);
      setErr(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>AI Remedies (Clinical Assistant)</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <select
            value={sel}
            onChange={(e) => setSel(e.target.value)}
            style={{ minWidth: 260 }}
          >
            <option value="">Select elder…</option>
            {elders.map((e) => {
              const list = getConditionList(e);
              const label = list.length ? list.join(", ") : "—";
              return (
                <option key={e._id} value={e._id}>
                  {e.name} — {label}
                </option>
              );
            })}
          </select>
          <button disabled={!sel || loading} onClick={run}>
            {loading ? "Analyzing…" : "Generate Remedies"}
          </button>
        </div>
        {err && <p className="error">{err}</p>}
      </div>

      {out && (
        <>
          <div className="card">
            <h3>Patient Snapshot</h3>
            <p>
              <b>Name:</b> {out.profile.name} ({out.profile.age})
            </p>
            <p>
              <b>Conditions:</b>{" "}
              {renderConditionBadges(getConditionList(out.profile))}
            </p>
            <p>
              <b>Hospital/Doctor:</b> {out.profile.hospital || "—"} /{" "}
              {out.profile.doctor || "—"}
            </p>
            <p>
              <b>Current meds:</b> {out.profile.meds?.join(", ") || "—"}
            </p>
          </div>

          <div className="card">
            <h3>Rules Engine Assessment</h3>
            <p>
              <b>Risk:</b> {out.rules.riskBand} (score {out.rules.risk})
            </p>
            {out.rules.issues.length > 0 ? (
              <>
                <p>
                  <b>Red/Amber findings:</b>
                </p>
                <ul>
                  {out.rules.issues.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p>No red flags from latest vitals.</p>
            )}
            {out.rules.recs.length > 0 && (
              <>
                <p>
                  <b>Evidence-based suggestions:</b>
                </p>
                <ul>
                  {out.rules.recs.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="card">
            <h3>LLM Care Plan</h3>
            {/* <p style={{ opacity: 0.7 }}>{out.llm.rationale}</p> */}
            {Array.isArray(out.llm.plan) && out.llm.plan.length ? (
              <ul>
                {out.llm.plan.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            ) : (
              <p>
                Connect an API key in <code>VITE_OPENAI_API_KEY</code> to enable
                refined plans.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
