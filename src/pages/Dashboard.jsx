import React, { useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { apiElders, apiVitals, apiHospital } from "../lib/fakeApi";
import VitalSimulator from "../components/VitalSimulator";
import LiveVitalsSimulator from "../components/LiveVitalsSimulator";
// --- helper (can move to utils.js later) ---
function renderConditions(e) {
  const list = Array.isArray(e?.conditions)
    ? e.conditions
    : e?.condition
    ? [e.condition]
    : [];
  if (list.length === 0) return <span className="muted">—</span>;
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

export default function Dashboard() {
  const { user } = useAuth();
  const [elders, setElders] = React.useState([]);
  const [hospitals, setHospitals] = React.useState([]);

  // const elders = useMemo(() => apiElders.listByOwner(user.id), [user.id]);
  useEffect(() => {
    async function fetchElders() {
      const res = await fetch(`/api/elders?ownerId=${user.id}`);
      const data = await res.json();
      return data;
    }
    fetchElders().then(setElders);
  }, [user.id]);
  useEffect(() => {
    async function fetchhospitals() {
      const res = await fetch(`/api/hospitals`);
      const data = await res.json();
      return data;
    }
    fetchhospitals().then(setHospitals);
  }, [user.id]);
  console.log("hospitals", hospitals);
  const simulate = (elderId) => {
    const hr = 60 + Math.round(Math.random() * 30);
    const spo2 = 94 + Math.round(Math.random() * 6);
    const sys = 110 + Math.round(Math.random() * 25);
    const dia = 70 + Math.round(Math.random() * 15);
    apiVitals.push(elderId, { hr, spo2, sys, dia });
    alert("Simulated vitals pushed.");
  };

  return (
    <div className="grid">
      <div className="card pad">
        <h3>Parent Health Summary</h3>

        {elders.length === 0 && (
          <p>No elders yet. Add from Services → Link Parent.</p>
        )}
        {elders.map((e) => {
          const hosp = hospitals.find((h) => h._id === e.hospitalId)?.name;
          return (
            <div
              key={e._id}
              className="row"
              style={{
                justifyContent: "space-between",
                borderTop: "1px solid #eee",
                paddingTop: 10,
                marginTop: 10,
              }}
            >
              <div>
                <div>
                  <strong>{e.name}</strong> — {e.age} yrs
                </div>
                {/* old: <div className="badge">{e.condition}</div> */}
                <div className="kv">
                  <b>Condition:</b> {renderConditions(e)}
                </div>
                <div style={{ opacity: 0.7, marginTop: 6 }}>
                  Hospital: {hosp}
                </div>
              </div>
              <button className="btn" onClick={() => simulate(e._id)}>
                Simulate Vital
              </button>
              <>
                <LiveVitalsSimulator elderId={e._id} />
              </>
            </div>
          );
        })}
      </div>

      {/* Add VitalSimulator here */}
      <div className="card pad">
        <h3>Vital Simulator</h3>
        <VitalSimulator />
      </div>

      <div className="grid two">
        <div className="card pad">
          <h3>Appointments</h3>
          <p>Manage from the Appointments tab.</p>
        </div>
        <div className="card pad">
          <h3>Emergency</h3>
          <button className="btn">Trigger Emergency Alert</button>
        </div>
      </div>
    </div>
  );
}
