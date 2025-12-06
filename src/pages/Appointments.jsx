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
    <div className="grid">
      <div className="card pad">
        <h3>New Appointment</h3>
        <div className="grid two">
          <select value={sel} onChange={(e) => setSel(e.target.value)}>
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
          />
          <input
            className="input"
            type="date"
            value={f.date}
            onChange={(e) => setF({ ...f, date: e.target.value })}
          />
          <input
            className="input"
            placeholder="Notes"
            value={f.notes}
            onChange={(e) => setF({ ...f, notes: e.target.value })}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <button className="btn" onClick={add}>
            Add
          </button>
        </div>
      </div>
      <div className="card pad">
        <h3>Appointments</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Doctor</th>
              <th>Notes</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id}>
                <td>{a.date}</td>
                <td>{a.doctor}</td>
                <td>{a.notes}</td>
                <td>
                  <button className="btn ghost" onClick={() => del(a.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
