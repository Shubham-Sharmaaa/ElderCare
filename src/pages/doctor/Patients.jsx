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
            <PatientCard key={p._id} patient={p} doctorId={user.id} />
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

  // useEffect(() => {
  //   setVitals(apiVitals.recent(patient.id, 6));
  //   setNotes(apiNotes.list(patient.id));
  //   setReports(apiReports.listForElder(patient.id));

  //   // sync conditions
  //   setConds(
  //     Array.isArray(patient.conditions)
  //       ? patient.conditions
  //       : patient.condition
  //       ? [patient.condition]
  //       : []
  //   );
  // }, [patient.id, patient.conditions, patient.condition]);
  useEffect(() => {
    let alive = true;
    const pid = patient?.id || patient?._id;

    if (!pid) return;

    async function loadPatientData() {
      try {
        const [vRes, nRes, rRes] = await Promise.all([
          apiVitals.recent(pid, 6),
          apiNotes.list(pid),
          apiReports.listForElder(pid),
        ]);

        if (!alive) return;

        // if your APIs return {data: []}, normalize to arrays
        const vitalsArr = Array.isArray(vRes)
          ? vRes
          : vRes?.data || vRes?.items || [];
        const notesArr = Array.isArray(nRes)
          ? nRes
          : nRes?.data || nRes?.items || [];
        const repsArr = Array.isArray(rRes)
          ? rRes
          : rRes?.data || rRes?.items || [];

        setVitals(vitalsArr);
        setNotes(notesArr);
        setReports(repsArr);

        // sync conditions
        setConds(
          Array.isArray(patient.conditions)
            ? patient.conditions
            : patient.condition
            ? [patient.condition]
            : []
        );
      } catch (err) {
        console.error("loadPatientData failed:", err);
        if (!alive) return;
        setVitals([]);
        setNotes([]);
        setReports([]);
        setConds(
          Array.isArray(patient.conditions)
            ? patient.conditions
            : patient.condition
            ? [patient.condition]
            : []
        );
      }
    }

    loadPatientData();

    return () => {
      alive = false;
    };
  }, [patient?.id, patient?._id, patient?.conditions, patient?.condition]);

  console.log("vitals  ", vitals);
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
