import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiElders, apiHospital } from "../lib/fakeApi";

export default function LinkParent() {
  const { user } = useAuth();
  const hospitals = apiHospital.list();
  const elders = useMemo(() => apiElders.listByOwner(user.id), [user.id]);
  const [f, setF] = useState({
    name: "",
    age: "",
    condition: "",
    notes: "",
    hospitalId: hospitals[0]?.id,
  });
  const [assigned, setAssigned] = useState(null);

  const add = () => {
    const e = apiElders.create({ ownerId: user.id, ...f });
    setF({
      name: "",
      age: "",
      condition: "",
      notes: "",
      hospitalId: hospitals[0]?.id,
    });
    setAssigned(e);
  };

  return (
    <div className="grid">
      <div className="card pad">
        <h3>Add/Link Parent</h3>
        <div className="grid two">
          <input
            className="input"
            placeholder="Name"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Age"
            value={f.age}
            onChange={(e) => setF({ ...f, age: e.target.value })}
          />
          <input
            className="input"
            placeholder="Condition"
            value={f.condition}
            onChange={(e) => setF({ ...f, condition: e.target.value })}
          />
          <input
            className="input"
            placeholder="Notes"
            value={f.notes}
            onChange={(e) => setF({ ...f, notes: e.target.value })}
          />
          <select
            value={f.hospitalId}
            onChange={(e) => setF({ ...f, hospitalId: e.target.value })}
          >
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: 10 }}>
          <button className="btn" onClick={add}>
            Add
          </button>
        </div>
      </div>

      <div className="card pad">
        <h3>Linked Parents</h3>
        <ul>
          {elders.map((e) => (
            <li key={e.id}>
              <strong>{e.name}</strong> — {e.condition}
            </li>
          ))}
        </ul>
        {assigned && (
          <p>
            Created: <strong>{assigned.name}</strong>. Assign doctor from
            hospital portal.
          </p>
        )}
      </div>
    </div>
  );
}
