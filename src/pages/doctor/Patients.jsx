// import React, { useEffect, useMemo, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import {
//   apiElders,
//   apiVitals,
//   apiReports,
//   apiNotes,
//   apiAppointments,
// } from "../../lib/fakeApi";

// export default function DoctorPatients() {
//   const { user } = useAuth();
//   const [rows, setRows] = useState([]);
//   const [filter, setFilter] = useState("");

//   useEffect(() => {
//     if (!user?.id) return;
//     setRows(apiElders.listByDoctor(user.id) || []);
//   }, [user?.id]);
//   useEffect(() => {
//     function onDbChange() {
//       if (user?.id) setRows(apiElders.listByDoctor(user.id) || []);
//     }
//     window.addEventListener("wn:db", onDbChange);
//     return () => window.removeEventListener("wn:db", onDbChange);
//   }, [user?.id]);
//   const filtered = useMemo(() => {
//     const q = filter.trim().toLowerCase();
//     if (!q) return rows;
//     return rows.filter(
//       (e) =>
//         e.name.toLowerCase().includes(q) ||
//         (e.condition || "").toLowerCase().includes(q)
//     );
//   }, [rows, filter]);

//   return (
//     <div className="page">
//       <h1 className="page-title" style={{ marginBottom: 8 }}>
//         Assigned Patients
//       </h1>

//       <div
//         className="row"
//         style={{ justifyContent: "space-between", marginBottom: 12 }}
//       >
//         <input
//           className="input"
//           placeholder="Search patient or condition…"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           style={{ flex: 1, minWidth: 240 }}
//         />
//         <span className="badge" style={{ alignSelf: "center" }}>
//           {filtered.length} total
//         </span>
//       </div>

//       {filtered.length === 0 ? (
//         <div className="card">No patients found.</div>
//       ) : (
//         <div className="grid" style={{ gap: 16 }}>
//           {filtered.map((p) => (
//             <PatientCard key={p.id} patient={p} doctorId={user.id} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function PatientCard({ patient, doctorId }) {
//   const [vitals, setVitals] = useState([]);
//   const [notes, setNotes] = useState([]);
//   const [reports, setReports] = useState([]);
//   const [appt, setAppt] = useState({ date: "", notes: "" });
//   const [newNote, setNewNote] = useState("");
//   const [upload, setUpload] = useState({ title: "", url: "" });

//   // NEW: condition state
//   const [condText, setCondText] = useState(patient.condition || "");
//   const [condSaving, setCondSaving] = useState(false);

//   useEffect(() => {
//     setVitals(apiVitals.recent(patient.id, 6));
//     setNotes(apiNotes.list(patient.id));
//     setReports(apiReports.listForElder(patient.id));
//   }, [patient.id]);

//   const latest = vitals.slice(-1)[0];

//   const addNote = () => {
//     if (!newNote.trim()) return;
//     apiNotes.add({ elderId: patient.id, doctorId, text: newNote.trim() });
//     setNotes(apiNotes.list(patient.id));
//     setNewNote("");
//   };

//   const uploadReport = () => {
//     if (!upload.title.trim() || !upload.url.trim()) return;
//     apiReports.upload({
//       elderId: patient.id,
//       title: upload.title.trim(),
//       url: upload.url.trim(),
//     });
//     setReports(apiReports.listForElder(patient.id));
//     setUpload({ title: "", url: "" });
//   };

//   const setReportStatus = (id, status) => {
//     apiReports.setStatus(id, status);
//     setReports(apiReports.listForElder(patient.id));
//   };

//   const createAppt = () => {
//     if (!appt.date) return;
//     apiAppointments.add({
//       elderId: patient.id,
//       doctor: "(you)",
//       date: appt.date,
//       notes: appt.notes || "",
//     });
//     setAppt({ date: "", notes: "" });
//     alert("Appointment created");
//   };

//   return (
//     <div className="card">
//       {/* Header */}
//       <div
//         className="row"
//         style={{ justifyContent: "space-between", alignItems: "flex-start" }}
//       >
//         <div>
//           <div className="section-title" style={{ marginBottom: 4 }}>
//             {patient.name}
//           </div>
//           <div className="kv">
//             {patient.age} yrs · {condText || "—"}
//           </div>
//           <div className="kv">Notes: {patient.notes || "—"}</div>
//         </div>

//         <div style={{ textAlign: "right" }}>
//           <div className="muted" style={{ marginBottom: 4 }}>
//             Latest Vitals
//           </div>
//           {latest ? (
//             <span className="badge">
//               HR {latest.hr} · SpO₂ {latest.spo2}% · BP {latest.sys}/
//               {latest.dia}
//             </span>
//           ) : (
//             <span className="muted">—</span>
//           )}
//         </div>
//       </div>

//       {/* Quick actions */}
//       <div className="card-grid" style={{ marginTop: 12 }}>
//         {/* Add Note */}
//         <div className="card" style={{ margin: 0 }}>
//           <div className="section-title">Add Doctor Note</div>
//           <textarea
//             className="textarea"
//             value={newNote}
//             onChange={(e) => setNewNote(e.target.value)}
//             placeholder="Observation, plan, etc."
//           />
//           <button className="btn" style={{ marginTop: 8 }} onClick={addNote}>
//             Save Note
//           </button>
//         </div>

//         {/* Upload Report */}
//         <div className="card" style={{ margin: 0 }}>
//           <div className="section-title">Upload Report (link)</div>
//           <input
//             className="input"
//             placeholder="Title (e.g., CBC, MRI…)"
//             value={upload.title}
//             onChange={(e) => setUpload({ ...upload, title: e.target.value })}
//             style={{ marginBottom: 8 }}
//           />
//           <input
//             className="input"
//             placeholder="URL to file (Drive/Share link)"
//             value={upload.url}
//             onChange={(e) => setUpload({ ...upload, url: e.target.value })}
//             style={{ marginBottom: 8 }}
//           />
//           <button className="btn" onClick={uploadReport}>
//             Upload
//           </button>
//         </div>

//         {/* Update Condition */}
//         <div className="card" style={{ margin: 0 }}>
//           <div className="section-title">Update Condition</div>

//           <input
//             className="input"
//             placeholder="e.g., Hypertension, Type 2 Diabetes"
//             value={condText}
//             onChange={(e) => setCondText(e.target.value)}
//             style={{ marginBottom: 8 }}
//           />

//           <div className="row">
//             <button
//               className="btn"
//               disabled={condSaving}
//               onClick={async () => {
//                 if (!condText.trim()) return;
//                 try {
//                   setCondSaving(true);
//                   apiElders.setCondition(patient.id, condText.trim());
//                   apiNotes.add({
//                     elderId: patient.id,
//                     doctorId,
//                     text: `Condition set to: ${condText.trim()}`,
//                   });
//                 } finally {
//                   setCondSaving(false);
//                 }
//               }}
//             >
//               {condSaving ? "Saving..." : "Save Condition"}
//             </button>

//             <button
//               className="btn ghost"
//               onClick={() => setCondText(patient.condition || "")}
//             >
//               Reset
//             </button>
//           </div>

//           <div className="row" style={{ marginTop: 8 }}>
//             {["Hypertension", "Type 2 Diabetes", "COPD", "CKD", "CAD"].map(
//               (c) => (
//                 <button
//                   key={c}
//                   className="btn btn-pill"
//                   onClick={() => setCondText(c)}
//                   type="button"
//                 >
//                   {c}
//                 </button>
//               )
//             )}
//           </div>
//         </div>

//         {/* Quick Appointment */}
//         <div className="card" style={{ margin: 0 }}>
//           <div className="section-title">Create Appointment</div>
//           <input
//             type="date"
//             className="input"
//             value={appt.date}
//             onChange={(e) => setAppt({ ...appt, date: e.target.value })}
//             style={{ marginBottom: 8 }}
//           />
//           <input
//             className="input"
//             placeholder="Notes (optional)"
//             value={appt.notes}
//             onChange={(e) => setAppt({ ...appt, notes: e.target.value })}
//             style={{ marginBottom: 8 }}
//           />
//           <button className="btn" onClick={createAppt}>
//             Add
//           </button>
//         </div>
//       </div>

//       {/* Notes & Reports */}
//       <div className="grid two" style={{ marginTop: 16 }}>
//         {/* Notes */}
//         <div className="card" style={{ margin: 0 }}>
//           <div className="section-title">Notes</div>
//           {notes.length === 0 ? (
//             <div className="muted">No notes yet.</div>
//           ) : (
//             <ul className="grid" style={{ gap: 8 }}>
//               {notes.map((n) => (
//                 <li
//                   key={n.id}
//                   className="card"
//                   style={{ margin: 0, padding: 10 }}
//                 >
//                   <div className="kv">{new Date(n.tsISO).toLocaleString()}</div>
//                   <div>{n.text}</div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Reports */}
//         <div className="card" style={{ margin: 0 }}>
//           <div className="section-title">Reports</div>
//           {reports.length === 0 ? (
//             <div className="muted">No reports.</div>
//           ) : (
//             <ul className="grid" style={{ gap: 8 }}>
//               {reports.map((r) => (
//                 <li key={r.id} className="card" style={{ margin: 0 }}>
//                   <div
//                     className="row"
//                     style={{ justifyContent: "space-between" }}
//                   >
//                     <div>
//                       <div className="kv">
//                         <b>{r.title}</b>
//                       </div>
//                       <div className="kv" style={{ fontSize: 12 }}>
//                         {new Date(r.tsISO).toLocaleString()} ·{" "}
//                         <a
//                           href={r.url}
//                           target="_blank"
//                           rel="noreferrer"
//                           style={{ color: "var(--brand)" }}
//                         >
//                           open
//                         </a>
//                       </div>
//                     </div>

//                     <div>
//                       <StatusPill status={r.status} />
//                       {r.status === "pending" && (
//                         <div className="row" style={{ marginTop: 8 }}>
//                           <button
//                             className="btn btn-pill"
//                             onClick={() => setReportStatus(r.id, "approved")}
//                           >
//                             Approve
//                           </button>
//                           <button
//                             className="btn btn-pill"
//                             style={{ background: "#e34c4c" }}
//                             onClick={() => setReportStatus(r.id, "rejected")}
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatusPill({ status }) {
//   let cls = "status status--pending";
//   if (status === "approved") cls = "status status--approved";
//   if (status === "rejected") cls = "status status--rejected";
//   return (
//     <span className={cls} style={{ whiteSpace: "nowrap" }}>
//       {status}
//     </span>
//   );
//}
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  apiElders,
  apiVitals,
  apiReports,
  apiNotes,
  apiAppointments,
} from "../../lib/fakeApi";

// Suggested conditions
const COMMON_CONDITIONS = [
  "Hypertension",
  "Diabetes",
  "COPD",
  "Asthma",
  "CKD",
  "CAD",
  "Heart Failure",
  "Hypothyroidism",
  "Hyperlipidemia",
  "Arthritis",
  "Anxiety",
  "Depression",
];

export default function DoctorPatients() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("");

  // useEffect(() => {
  //   if (!user?.id) return;
  //   setRows(apiElders.listByDoctor(user.id) || []);
  // }, [user?.id]);
  useEffect(() => {
    if (!user?.id) return;
    async function loadDoctorElders(doctorId) {
      try {
        const res = await fetch(
          `/api/elders?doctorId=${encodeURIComponent(doctorId)}`
        );
        if (!res.ok) throw new Error("API error");
        return await res.json();
      } catch (err) {
        console.warn(
          "[doctor] backend failed, fallback to fakeApi:",
          err?.message
        );
        console.log(
          "Fallback to local apiElders.listByDoctor for doctorId:",
          doctorId
        );
        return apiElders.listByDoctor(doctorId); // local
      }
    }
    loadDoctorElders(user.id).then(setRows);
  }, [user?.id]);
  useEffect(() => {
    function onDbChange() {
      if (user?.id) setRows(apiElders.listByDoctor(user.id) || []);
    }
    window.addEventListener("wn:db", onDbChange);
    return () => window.removeEventListener("wn:db", onDbChange);
  }, [user?.id]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (Array.isArray(e.conditions)
          ? e.conditions.join(",")
          : e.condition || ""
        )
          .toLowerCase()
          .includes(q)
    );
  }, [rows, filter]);

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 8 }}>
        Assigned Patients
      </h1>

      <div
        className="row"
        style={{ justifyContent: "space-between", marginBottom: 12 }}
      >
        <input
          className="input"
          placeholder="Search patient or condition…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ flex: 1, minWidth: 240 }}
        />
        <span className="badge" style={{ alignSelf: "center" }}>
          {filtered.length} total
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="card">No patients found.</div>
      ) : (
        <div className="grid" style={{ gap: 16 }}>
          {filtered.map((p) => (
            <PatientCard key={p.id} patient={p} doctorId={user.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function PatientCard({ patient, doctorId }) {
  const [vitals, setVitals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [reports, setReports] = useState([]);
  const [appt, setAppt] = useState({ date: "", notes: "" });
  const [newNote, setNewNote] = useState("");
  const [upload, setUpload] = useState({ title: "", url: "" });

  // NEW: multi condition editor state
  const [conds, setConds] = useState([]);
  const [condInput, setCondInput] = useState("");

  useEffect(() => {
    setVitals(apiVitals.recent(patient.id, 6));
    setNotes(apiNotes.list(patient.id));
    setReports(apiReports.listForElder(patient.id));

    // sync conditions
    setConds(
      Array.isArray(patient.conditions)
        ? patient.conditions
        : patient.condition
        ? [patient.condition]
        : []
    );
  }, [patient.id, patient.conditions, patient.condition]);

  const latest = vitals.slice(-1)[0];

  const addCond = (raw) => {
    const c = String(raw || condInput).trim();
    if (!c) return;
    const next = Array.from(new Set([...conds, c]));
    setConds(next);
    setCondInput("");
  };

  const removeCond = (c) =>
    setConds(conds.filter((x) => x.toLowerCase() !== c.toLowerCase()));

  const saveConds = () => {
    apiElders.setConditions(patient.id, conds);
    patient.conditions = conds;
    patient.condition = conds[0] || "";
    alert("Conditions updated");
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    apiNotes.add({ elderId: patient.id, doctorId, text: newNote.trim() });
    setNotes(apiNotes.list(patient.id));
    setNewNote("");
  };

  const uploadReport = () => {
    if (!upload.title.trim() || !upload.url.trim()) return;
    apiReports.upload({
      elderId: patient.id,
      title: upload.title.trim(),
      url: upload.url.trim(),
    });
    setReports(apiReports.listForElder(patient.id));
    setUpload({ title: "", url: "" });
  };

  const setReportStatus = (id, status) => {
    apiReports.setStatus(id, status);
    setReports(apiReports.listForElder(patient.id));
  };

  const createAppt = () => {
    if (!appt.date) return;
    apiAppointments.add({
      elderId: patient.id,
      doctor: "(you)",
      date: appt.date,
      notes: appt.notes || "",
    });
    setAppt({ date: "", notes: "" });
    alert("Appointment created");
  };

  const conditionText =
    Array.isArray(patient.conditions) && patient.conditions.length
      ? patient.conditions.join(", ")
      : patient.condition || "—";

  return (
    <div className="card">
      {/* Header */}
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <div>
          <div className="section-title" style={{ marginBottom: 4 }}>
            {patient.name}
          </div>
          <div className="kv">
            {patient.age} yrs · {conditionText}
          </div>
          <div className="kv">Notes: {patient.notes || "—"}</div>

          {/* Condition editor */}
          <div className="row" style={{ marginTop: 8, alignItems: "center" }}>
            <div className="muted" style={{ minWidth: 90 }}>
              Conditions:
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {conds.map((c) => (
                <span
                  key={c}
                  className="badge"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {c}
                  <button
                    className="btn btn-pill"
                    style={{ padding: "2px 6px", boxShadow: "none" }}
                    onClick={() => removeCond(c)}
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                className="input"
                style={{ width: 220 }}
                list="cond-suggestions"
                placeholder="Add or type custom…"
                value={condInput}
                onChange={(e) => setCondInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addCond();
                  }
                }}
              />
              <datalist id="cond-suggestions">
                {COMMON_CONDITIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <button className="btn btn-pill" onClick={() => addCond()}>
                Add
              </button>
              <button className="btn btn-pill" onClick={saveConds}>
                Save
              </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div className="muted" style={{ marginBottom: 4 }}>
            Latest Vitals
          </div>
          {latest ? (
            <span className="badge">
              HR {latest.hr} · SpO₂ {latest.spo2}% · BP {latest.sys}/
              {latest.dia}
            </span>
          ) : (
            <span className="muted">—</span>
          )}
        </div>
      </div>
      {/* Quick actions (unchanged except Update Condition block removed) */}
      ...
    </div>
  );
}

function StatusPill({ status }) {
  let cls = "status status--pending";
  if (status === "approved") cls = "status status--approved";
  if (status === "rejected") cls = "status status--rejected";
  return (
    <span className={cls} style={{ whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}
