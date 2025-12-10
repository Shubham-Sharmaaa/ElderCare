import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiHospital } from "../../lib/fakeApi";

export default function HospitalDoctors() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  // useEffect(() => {
  //   if (!user?.hospitalId) return;
  //   async function fetchDoctors() {
  //     const doctors = await apiHospital.doctors(user.hospitalId);
  //     return doctors;
  //   }
  //   try {
  //     const doctors = fetchDoctors();
  //     setRows(doctors);
  //   } catch (e) {
  //     setErr(e?.message || "Failed to load doctors");
  //   }
  // }, [user?.hospitalId]);
  useEffect(() => {
    if (!user?.hospitalId) return;

    let alive = true;

    async function load() {
      try {
        const doctors = await apiHospital.doctors(user.hospitalId);
        if (alive) setRows(doctors || []);
      } catch (e) {
        if (alive) setErr(e?.message || "Failed to load doctors");
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [user?.hospitalId]);

  const add = async () => {
    setErr("");
    if (!name.trim() || !email.trim()) {
      setErr("Name and email are required.");
      return;
    }
    try {
      await apiHospital.addDoctor(user.hospitalId, name.trim(), email.trim());
      const doctors = await apiHospital.doctors(user.hospitalId);
      setRows(doctors);
      setName("");
      setEmail("");
    } catch (e) {
      setErr(e?.message || "Failed to add doctor");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Doctors at {user?.name}</h1>

      <div className="card pad">
        <h3>Add Doctor</h3>
        <div className="row" style={{ gap: 8, marginTop: 8 }}>
          <input
            className="input"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Email (used to log in)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn" onClick={add}>
            Add
          </button>
        </div>
        {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}
        <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
          Doctors can log in from the login screen by choosing “Doctor” and
          selecting their email.
        </div>
      </div>

      <div className="card pad">
        <h3>Current Doctors</h3>
        {rows.length === 0 ? (
          <p>No doctors yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
