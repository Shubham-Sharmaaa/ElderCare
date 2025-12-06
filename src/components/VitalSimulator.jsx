// src/components/VitalSimulator.jsx
import React, { useState } from "react";
import { apiVitals } from "../lib/fakeApi";
import { usePatients } from "../context/PatientContext";

export default function VitalSimulator() {
  const { elders, refresh } = usePatients();
  const [elderId, setElderId] = useState("");
  const [vals, setVals] = useState({ hr: 78, spo2: 96, sys: 122, dia: 78 });
  const [ok, setOk] = useState("");

  const push = () => {
    if (!elderId) return;
    apiVitals.push(elderId, {
      hr: Number(vals.hr),
      spo2: Number(vals.spo2),
      sys: Number(vals.sys),
      dia: Number(vals.dia),
    });
    setOk("Sample recorded.");
    setTimeout(() => setOk(""), 1200);
    refresh?.();
  };

  return (
    <div className="card">
      <h3>Live Vitals (Simulator)</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <select value={elderId} onChange={(e) => setElderId(e.target.value)}>
          <option value="">Select elder…</option>
          {elders.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label>HR</label>
          <input
            type="number"
            value={vals.hr}
            onChange={(e) => setVals((v) => ({ ...v, hr: e.target.value }))}
          />
          <label>SpO₂</label>
          <input
            type="number"
            value={vals.spo2}
            onChange={(e) => setVals((v) => ({ ...v, spo2: e.target.value }))}
          />
          <label>BP</label>
          <input
            type="number"
            value={vals.sys}
            onChange={(e) => setVals((v) => ({ ...v, sys: e.target.value }))}
            style={{ width: 70 }}
          />{" "}
          /
          <input
            type="number"
            value={vals.dia}
            onChange={(e) => setVals((v) => ({ ...v, dia: e.target.value }))}
            style={{ width: 70 }}
          />
          <button onClick={push} disabled={!elderId}>
            Push
          </button>
        </div>
      </div>
      {ok && <p className="ok">{ok}</p>}
      <p style={{ opacity: 0.7, marginTop: 8 }}>
        These values append to “timeline” and feed the AI tab.
      </p>
    </div>
  );
}
