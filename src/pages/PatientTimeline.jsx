import React, { use, useEffect, useMemo, useState } from "react";
import { apiElders, apiVitals } from "../lib/fakeApi";
import { useAuth } from "../context/AuthContext";
import { set } from "mongoose";

export default function PatientTimeline() {
  const { user } = useAuth();
  const [elders, setElders] = useState([]);

  const [list, setList] = useState([]);
  useEffect(() => {
    async function fetchElders(userId) {
      const res = await fetch(`/api/elders?ownerId=${userId}`);
      const data = await res.json();
      return data;
    }
    fetchElders(user.id).then(setElders);
  }, [user.id]);
  const [sel, setSel] = useState("");
  useEffect(() => {
    setSel(elders[0]?._id || "");
  }, [elders]);
  useEffect(() => {
    async function fetchVitals(elderId) {
      const res = await apiVitals.recent(elderId);
      return res;
    }
    fetchVitals(sel).then(setList);
  }, [sel]);
  return (
    <div className="card pad">
      <h3>Vitals Timeline</h3>
      <select value={sel} onChange={(e) => setSel(e.target.value)}>
        {elders.map((e) => (
          <option key={e._id} value={e._id}>
            {e.name}
          </option>
        ))}
      </select>
      <div style={{ marginTop: 10 }}>
        {list.length === 0 && (
          <p>No data yet. Use “Simulate Vital” on Dashboard.</p>
        )}
        {list.map((v) => (
          <div
            key={v.id}
            style={{ borderTop: "1px solid #eee", padding: "8px 0" }}
          >
            <strong>{new Date(v.tsISO).toLocaleString()}</strong> — HR {v.hr}{" "}
            bpm · SpO₂ {v.spo2}% · BP {v.sys}/{v.dia}
          </div>
        ))}
      </div>
    </div>
  );
}
