import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiElders, apiAppointments } from "../lib/fakeApi";

export default function Appointments() {
  const { user } = useAuth();
  // const elders = useMemo(() => apiElders.listByOwner(user.id), [user.id]);
  const [elders, setElders] = useState([]);
  const [sel, setSel] = useState(elders[0]?.id || "");
  const [f, setF] = useState({ doctor: "", date: "", notes: "" });

  const list = useMemo(() => (sel ? apiAppointments.list(sel) : []), [sel]);

  const add = (e) => {
    e.preventDefault();
    if (!sel) return;
    apiAppointments.add({ elderId: sel, ...f });
    setF({ doctor: "", date: "", notes: "" });
  };
  const del = (id) => {
    apiAppointments.remove(id);
  };
  useEffect(() => {
    async function fetchElders(userId) {
      const res = await apiElders.listByOwner(userId);
      return res;
    }
    fetchElders(user.id).then(setElders);
  }, [user.id]);
  return (
    <div
      className="grid"
      style={{
        display: "grid",
        gap: 18,
        maxWidth: 1050,
        margin: "0 auto",
        padding: "6px 2px",
      }}
    >
      {/* New Appointment */}
      <div
        className="card pad"
        style={{
          background: "#fff",
          border: "1px solid #E7EEF7",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(16,24,40,0.06)",
          padding: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            New Appointment
          </h3>
          <div style={{ fontSize: 12, color: "#64748B" }}>
            Add details and save
          </div>
        </div>

        <div
          className="grid two"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
            marginTop: 14,
          }}
        >
          <select
            value={sel}
            onChange={(e) => setSel(e.target.value)}
            style={{
              height: 44,
              width: "100%",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              background: "#fff",
              padding: "0 12px",
              fontSize: 14,
              color: "#0F172A",
              outline: "none",
              boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
            }}
          >
            {elders.map((e) => (
              <option key={e._id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>

          <input
            className="input"
            placeholder="Doctor"
            value={f.doctor}
            onChange={(e) => setF({ ...f, doctor: e.target.value })}
            style={{
              height: 44,
              width: "100%",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              background: "#fff",
              padding: "0 12px",
              fontSize: 14,
              color: "#0F172A",
              outline: "none",
              boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
            }}
          />

          <input
            className="input"
            type="date"
            value={f.date}
            onChange={(e) => setF({ ...f, date: e.target.value })}
            style={{
              height: 44,
              width: "100%",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              background: "#fff",
              padding: "0 12px",
              fontSize: 14,
              color: "#0F172A",
              outline: "none",
              boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
            }}
          />

          <input
            className="input"
            placeholder="Notes"
            value={f.notes}
            onChange={(e) => setF({ ...f, notes: e.target.value })}
            style={{
              height: 44,
              width: "100%",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              background: "#fff",
              padding: "0 12px",
              fontSize: 14,
              color: "#0F172A",
              outline: "none",
              boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <button
            className="btn"
            onClick={add}
            style={{
              height: 40,
              padding: "0 16px",
              borderRadius: 12,
              border: "1px solid #1D4ED8",
              background: "#1D4ED8",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 10px 18px rgba(29,78,216,0.18)",
            }}
          >
            Add
          </button>
        </div>

        {/* subtle divider */}
        <div style={{ marginTop: 16, height: 1, background: "#EEF2F7" }} />
      </div>

      {/* Appointments List */}
      <div
        className="card pad"
        style={{
          background: "#fff",
          border: "1px solid #E7EEF7",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(16,24,40,0.06)",
          padding: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            Appointments
          </h3>
          <div
            style={{
              fontSize: 12,
              color: "#0F172A",
              background: "#F1F5F9",
              border: "1px solid #E2E8F0",
              padding: "6px 10px",
              borderRadius: 999,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {list.length} total
          </div>
        </div>

        <div style={{ marginTop: 12, overflowX: "auto" }}>
          <table
            className="table"
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              fontSize: 14,
              color: "#0F172A",
            }}
          >
            <thead>
              <tr>
                {["Date", "Doctor", "Notes", ""].map((h, idx) => (
                  <th
                    key={idx}
                    style={{
                      textAlign: "left",
                      padding: "12px 12px",
                      fontSize: 12,
                      letterSpacing: "0.02em",
                      color: "#64748B",
                      fontWeight: 800,
                      borderBottom: "1px solid #EEF2F7",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {list.map((a) => (
                <tr key={a.id} style={{ background: "#fff" }}>
                  <td
                    style={{
                      padding: "12px 12px",
                      borderBottom: "1px solid #F1F5F9",
                      whiteSpace: "nowrap",
                      color: "#0F172A",
                      fontWeight: 700,
                    }}
                  >
                    {a.date}
                  </td>

                  <td
                    style={{
                      padding: "12px 12px",
                      borderBottom: "1px solid #F1F5F9",
                      color: "#0F172A",
                      fontWeight: 600,
                    }}
                  >
                    {a.doctor}
                  </td>

                  <td
                    style={{
                      padding: "12px 12px",
                      borderBottom: "1px solid #F1F5F9",
                      color: "#334155",
                      maxWidth: 520,
                    }}
                  >
                    <span style={{ display: "inline-block", opacity: 0.95 }}>
                      {a.notes}
                    </span>
                  </td>

                  <td
                    style={{
                      padding: "12px 12px",
                      borderBottom: "1px solid #F1F5F9",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <button
                      className="btn ghost"
                      onClick={() => del(a.id)}
                      style={{
                        height: 34,
                        padding: "0 12px",
                        borderRadius: 10,
                        border: "1px solid #E2E8F0",
                        background: "#fff",
                        color: "#DC2626",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {list.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: 14, color: "#64748B" }}>
                    No appointments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsive without touching your logic */}
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
  //       <h3>New Appointment</h3>
  //       <div className="grid two">
  //         <select value={sel} onChange={(e) => setSel(e.target.value)}>
  //           {elders.map((e) => (
  //             <option key={e._id} value={e.id}>
  //               {e.name}
  //             </option>
  //           ))}
  //         </select>
  //         <input
  //           className="input"
  //           placeholder="Doctor"
  //           value={f.doctor}
  //           onChange={(e) => setF({ ...f, doctor: e.target.value })}
  //         />
  //         <input
  //           className="input"
  //           type="date"
  //           value={f.date}
  //           onChange={(e) => setF({ ...f, date: e.target.value })}
  //         />
  //         <input
  //           className="input"
  //           placeholder="Notes"
  //           value={f.notes}
  //           onChange={(e) => setF({ ...f, notes: e.target.value })}
  //         />
  //       </div>
  //       <div style={{ marginTop: 10 }}>
  //         <button className="btn" onClick={add}>
  //           Add
  //         </button>
  //       </div>
  //     </div>
  //     <div className="card pad">
  //       <h3>Appointments</h3>
  //       <table className="table">
  //         <thead>
  //           <tr>
  //             <th>Date</th>
  //             <th>Doctor</th>
  //             <th>Notes</th>
  //             <th />
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {list.map((a) => (
  //             <tr key={a.id}>
  //               <td>{a.date}</td>
  //               <td>{a.doctor}</td>
  //               <td>{a.notes}</td>
  //               <td>
  //                 <button className="btn ghost" onClick={() => del(a.id)}>
  //                   Delete
  //                 </button>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );
}
