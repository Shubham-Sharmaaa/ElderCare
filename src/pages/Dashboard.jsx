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
    <div
      style={{
        display: "grid",
        gap: 16,
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      {/* Parent Health Summary */}
      <div
        className="card pad"
        style={{
          borderRadius: 16,
          border: "1px solid #E8EEF6",
          background: "#fff",
          boxShadow: "0 8px 24px rgba(16, 24, 40, 0.06)",
          padding: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Parent Health Summary
            </h3>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
              Linked parents overview
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#0F172A",
              background: "#F1F5F9",
              border: "1px solid #E2E8F0",
              padding: "6px 10px",
              borderRadius: 999,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {elders.length} linked
          </div>
        </div>

        {elders.length === 0 && (
          <div
            style={{
              borderRadius: 14,
              border: "1px dashed #CBD5E1",
              background: "#FAFAFB",
              padding: 16,
              color: "#475569",
              fontSize: 14,
            }}
          >
            No elders yet. Add from <b>Services → Link Parent</b>.
          </div>
        )}

        {elders.map((e) => {
          const hosp = hospitals.find((h) => h._id === e.hospitalId)?.name;

          return (
            <div
              key={e._id}
              className="row"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 14,
                borderTop: "1px solid #EEF2F7",
                paddingTop: 14,
                marginTop: 14,
              }}
            >
              {/* Left info */}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}
                  >
                    {e.name}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1D4ED8",
                      background: "#EFF6FF",
                      border: "1px solid #DBEAFE",
                      padding: "4px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {e.age} yrs
                  </div>
                </div>

                <div
                  className="kv"
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: "#334155",
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ color: "#64748B", fontWeight: 600 }}>
                    Condition:{" "}
                  </span>
                  <span style={{ fontWeight: 600 }}>{renderConditions(e)}</span>
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12.5,
                    color: "#64748B",
                  }}
                >
                  Hospital:{" "}
                  <span style={{ color: "#334155", fontWeight: 600 }}>
                    {hosp || "—"}
                  </span>
                </div>
              </div>

              {/* Right actions */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  alignItems: "flex-end",
                }}
              >
                <button
                  className="btn"
                  onClick={() => simulate(e._id)}
                  style={{
                    border: "1px solid #0F172A",
                    background: "#0F172A",
                    color: "white",
                    padding: "10px 12px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 6px 14px rgba(15, 23, 42, 0.18)",
                  }}
                >
                  Simulate Vital
                </button>

                {/* Keep your simulator exactly as-is */}
                <div
                  style={{
                    borderRadius: 14,
                    border: "1px solid #EEF2F7",
                    background: "#F8FAFC",
                    padding: 10,
                    width: 320,
                    maxWidth: "70vw",
                  }}
                >
                  <LiveVitalsSimulator elderId={e._id} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vital Simulator */}
      <div
        className="card pad"
        style={{
          borderRadius: 16,
          border: "1px solid #E8EEF6",
          background: "#fff",
          boxShadow: "0 8px 24px rgba(16, 24, 40, 0.06)",
          padding: 16,
        }}
      >
        <h3
          style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}
        >
          Vital Simulator
        </h3>
        <div style={{ marginTop: 12 }}>
          <VitalSimulator />
        </div>
      </div>

      {/* Bottom two cards */}
      <div
        className="grid two"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {/* Appointments */}
        <div
          className="card pad"
          style={{
            borderRadius: 16,
            border: "1px solid #E8EEF6",
            background: "#fff",
            boxShadow: "0 8px 24px rgba(16, 24, 40, 0.06)",
            padding: 16,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            Appointments
          </h3>
          <p
            style={{
              marginTop: 10,
              marginBottom: 0,
              color: "#64748B",
              fontSize: 13,
            }}
          >
            Manage from the Appointments tab.
          </p>
        </div>

        {/* Emergency */}
        <div
          className="card pad"
          style={{
            borderRadius: 16,
            border: "1px solid #FEE2E2",
            background: "#fff",
            boxShadow: "0 8px 24px rgba(16, 24, 40, 0.06)",
            padding: 16,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            Emergency
          </h3>

          <button
            className="btn"
            style={{
              marginTop: 12,
              width: "100%",
              border: "1px solid #DC2626",
              background: "#DC2626",
              color: "white",
              padding: "10px 12px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(220, 38, 38, 0.20)",
            }}
          >
            Trigger Emergency Alert
          </button>

          <div style={{ marginTop: 10, fontSize: 12.5, color: "#64748B" }}>
            Use only when urgent.
          </div>
        </div>
      </div>

      {/* Small responsive tweak without changing logic */}
      <style>{`
      @media (max-width: 860px) {
        .grid.two { grid-template-columns: 1fr !important; }
      }
    `}</style>
    </div>
  );

  // return (
  //   <div className="grid">
  //     <div className="card pad">
  //       <h3>Parent Health Summary</h3>

  //       {elders.length === 0 && (
  //         <p>No elders yet. Add from Services → Link Parent.</p>
  //       )}
  //       {elders.map((e) => {
  //         const hosp = hospitals.find((h) => h._id === e.hospitalId)?.name;
  //         return (
  //           <div
  //             key={e._id}
  //             className="row"
  //             style={{
  //               justifyContent: "space-between",
  //               borderTop: "1px solid #eee",
  //               paddingTop: 10,
  //               marginTop: 10,
  //             }}
  //           >
  //             <div>
  //               <div>
  //                 <strong>{e.name}</strong> — {e.age} yrs
  //               </div>
  //               {/* old: <div className="badge">{e.condition}</div> */}
  //               <div className="kv">
  //                 <b>Condition:</b> {renderConditions(e)}
  //               </div>
  //               <div style={{ opacity: 0.7, marginTop: 6 }}>
  //                 Hospital: {hosp}
  //               </div>
  //             </div>
  //             <button className="btn" onClick={() => simulate(e._id)}>
  //               Simulate Vital
  //             </button>
  //             <>
  //               <LiveVitalsSimulator elderId={e._id} />
  //             </>
  //           </div>
  //         );
  //       })}
  //     </div>

  //     {/* Add VitalSimulator here */}
  //     <div className="card pad">
  //       <h3>Vital Simulator</h3>
  //       <VitalSimulator />
  //     </div>

  //     <div className="grid two">
  //       <div className="card pad">
  //         <h3>Appointments</h3>
  //         <p>Manage from the Appointments tab.</p>
  //       </div>
  //       <div className="card pad">
  //         <h3>Emergency</h3>
  //         <button className="btn">Trigger Emergency Alert</button>
  //       </div>
  //     </div>
  //   </div>
  // );
}
