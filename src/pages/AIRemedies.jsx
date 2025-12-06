// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { apiElders, apiAi } from "../lib/fakeApi";

// export default function AIRemedies() {
//   const { user } = useAuth();
//   const [elders, setElders] = useState([]);
//   const [selected, setSelected] = useState("");
//   const [result, setResult] = useState(null);

//   useEffect(() => {
//     const list = apiElders.listByOwner(user.id);
//     setElders(list);
//     if (list[0]) setSelected(list[0].id);
//   }, [user.id]);

//   const gen = () => {
//     const profile = apiAi.buildPatientProfile(selected);
//     // Here’s where you’d call your backend /gpt with `profile`.
//     // For now, produce a local, structured suggestion:
//     if (!profile) return;
//     setResult({
//       summary: `Elder ${profile.name}, ${profile.age} yrs, condition: ${
//         profile.condition || "—"
//       }.`,
//       suggestions: [
//         "Daily 20–30 min light walk unless contra-indicated.",
//         "Reduce sodium; keep fluids consistent if on diuretics.",
//         "Check BP twice daily for a week; record unusual readings.",
//         "Discuss medication timings with assigned doctor.",
//       ],
//       context: profile,
//     });
//   };

//   return (
//     <div className="card">
//       <h2>AI Remedies (prototype)</h2>

//       <div className="grid2">
//         <select
//           className="form-input"
//           value={selected}
//           onChange={(e) => setSelected(e.target.value)}
//         >
//           {elders.map((e) => (
//             <option key={e.id} value={e.id}>
//               {e.name}
//             </option>
//           ))}
//         </select>
//         <button className="button" onClick={gen}>
//           Generate Remedies
//         </button>
//       </div>

//       {result && (
//         <div className="card" style={{ marginTop: "1rem" }}>
//           <p>
//             <b>Summary:</b> {result.summary}
//           </p>
//           <p>
//             <b>Suggestions:</b>
//           </p>
//           <ul>
//             {result.suggestions.map((s, i) => (
//               <li key={i}>{s}</li>
//             ))}
//           </ul>
//           <details>
//             <summary>Data sent to AI</summary>
//             <pre style={{ whiteSpace: "pre-wrap" }}>
//               {JSON.stringify(result.context, null, 2)}
//             </pre>
//           </details>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import { usePatients } from "../context/PatientContext";
import { getAiRemedies } from "../lib/ai";

export default function AIRemedies() {
  const { elders = [] } = usePatients();
  const [elderId, setElderId] = useState(elders[0]?.id || "");
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function run() {
    setErr("");
    setOut(null);
    setLoading(true);
    try {
      setOut(await getAiRemedies(elderId));
    } catch (e) {
      setErr(e?.message || "AI error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">AI Care Plan (Ollama)</h1>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm mb-1">Select Elder</label>
          <select
            className="w-full border rounded p-2"
            value={elderId}
            onChange={(e) => setElderId(e.target.value)}
          >
            {elders.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.age})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={run}
          disabled={!elderId || loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Thinking…" : "Generate plan"}
        </button>
      </div>

      {err && (
        <div className="border border-red-300 bg-red-50 text-red-800 p-3 rounded">
          {err}
        </div>
      )}

      {out && (
        <div className="grid gap-4">
          <div className="border rounded p-4">
            <h2 className="font-medium mb-2">LLM Rationale</h2>
            <p className="text-sm opacity-80 mb-2">{out.rationale}</p>
            <ul className="list-disc pl-5 space-y-1">
              {(out.plan || []).map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="border rounded p-4">
            <h2 className="font-medium mb-2">Rules Engine</h2>
            <p className="text-sm">
              Risk band: <b>{out.rules?.riskBand}</b> (score {out.rules?.risk})
            </p>
            {out.rules?.issues?.length ? (
              <>
                <div className="font-medium mt-2">Issues:</div>
                <ul className="list-disc pl-5">
                  {out.rules.issues.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {out.rules?.recs?.length ? (
              <>
                <div className="font-medium mt-2">Recommendations:</div>
                <ul className="list-disc pl-5">
                  {out.rules.recs.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
