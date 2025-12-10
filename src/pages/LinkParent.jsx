import React, { use, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiElders, apiHospital } from "../lib/fakeApi";

export default function LinkParent() {
  const { user } = useAuth();
  console.log("usre", user);
  const [hospitals, setHospitals] = useState([]);
  useEffect(() => {
    if (!user.id) return;
    let alive = true;
    async function fetchhosp() {
      try {
        const hosp = await apiHospital.list();
        if (alive) setHospitals(hosp);
      } catch (e) {
        console.error(e);
      }
    }
    fetchhosp();
    return () => {
      alive = false;
    };
  }, [user.id]);
  // const hospitals = apiHospital.list();
  const [elders, setElders] = useState([]);
  // const elders = useMemo(() => apiElders.listByOwner(user.id), [user.id]);

  useEffect(() => {
    if (!user.id) return;
    let alive = true;
    async function fetchelder() {
      try {
        const elder = await apiElders.listByOwner(user.id);
        if (alive) setElders(elder);
      } catch (e) {
        console.error(e);
      }
    }
    fetchelder();
    return () => {
      alive = false;
    };
  }, [user.id]);
  console.log("hospital", hospitals[0]?._id);
  const [f, setF] = useState({
    name: "",
    age: "",
    condition: "",
    notes: "",
    hospitalId: hospitals[0]?._id,
  });
  // useEffect(() => {
  //   if (!f) return;
  //   setF({ hospitalId: hospitals[0]?._id, ...f });
  // }, [hospitals, f]);
  const [assigned, setAssigned] = useState(null);
  console.log("f", f);

  const add = async () => {
    console.log("ff", f);
    const e = await apiElders.create({ ownerId: user.id, ...f });
    setF({
      name: "",
      age: "",
      condition: "",
      notes: "",
      hospitalId: hospitals[0]?._id,
    });
    setAssigned(e);
  };
  useEffect(() => {
    if (!hospitals.length) return;

    setF((prev) =>
      prev.hospitalId
        ? prev // don’t overwrite if user already picked something
        : { ...prev, hospitalId: hospitals[0]._id }
    );
  }, [hospitals]);

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
              <option key={h._id} value={h._id}>
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
            <li key={e._id}>
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
