import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiElders, apiMeds } from "../lib/fakeApi";

export default function Meds() {
  const { user } = useAuth();
  const [elders, setElders] = useState([]);
  const [sel, setSel] = useState(elders[0]?.id || "");
  const [f, setF] = useState({ medicine: "Atenolol", timeHHmm: "08:00" });

  const list = useMemo(() => (sel ? apiMeds.listForElder(sel) : []), [sel]);

  const add = () => {
    apiMeds.add({ elderId: sel, ...f });
    setF({ medicine: "", timeHHmm: "08:00" });
  };
  const toggle = (id) => {
    apiMeds.toggle(id);
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
        <h3>Medication Schedule</h3>
        <div className="grid two">
          <select value={sel} onChange={(e) => setSel(e.target.value)}>
            {elders.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Medicine"
            value={f.medicine}
            onChange={(e) => setF({ ...f, medicine: e.target.value })}
          />
          <input
            className="input"
            type="time"
            value={f.timeHHmm}
            onChange={(e) => setF({ ...f, timeHHmm: e.target.value })}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <button className="btn" onClick={add}>
            Add
          </button>
        </div>
      </div>

      <div className="card pad">
        <h3>Today</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Medicine</th>
              <th>Taken</th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id}>
                <td>{m.timeHHmm}</td>
                <td>{m.medicine}</td>
                <td>
                  <button className="btn ghost" onClick={() => toggle(m.id)}>
                    Toggle
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
