import React, { useEffect, useState } from "react";
import { apiAdmin } from "../../lib/fakeApi";

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hosp, setHosp] = useState([]);

  const add = async () => {
    if (!name.trim()) return;
    await apiAdmin.createHospital(name.trim(), email.trim());
    const list = await apiAdmin.listHospitals();
    setHosp(list);
    setName("");
    setEmail("");
  };
  useEffect(() => {
    async function loadHospitals() {
      const res = await fetch("/api/hospitals");
      const hospitals = await res.json();

      return hospitals;
    }
    loadHospitals().then(setHosp);
  }, []);
  console.log("Hospitals:", hosp);
  return (
    <div className="grid">
      <div className="card pad">
        <h3>Onboard Hospital</h3>
        <div className="row">
          <input
            className="input"
            placeholder="Hospital name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Hospital email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn" onClick={add}>
            Add
          </button>
        </div>
      </div>

      <div className="card pad">
        <h3>Hospitals</h3>
        <ul>{hosp && hosp.map((h) => <li key={h._id}>{h.name}</li>)}</ul>
      </div>
    </div>
  );
}

// src/admin/AdminDashboard.jsx

// // src/admin/AdminDashboard.jsx
// import React, { useEffect, useState } from "react";
// import { apiAdmin, apiHospital } from "../../lib/fakeApi"; // path: src/lib/fakeApi.js

// export default function AdminDashboard() {
//   const api = apiAdmin;
//   const [hospitals, setHospitals] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [name, setName] = useState("");
//   const [error, setError] = useState("");

//   // helper that tolerates sync or Promise-returning API methods
//   const asPromise = (maybe) =>
//     maybe && typeof maybe.then === "function" ? maybe : Promise.resolve(maybe);

//   useEffect(() => {
//     let cancelled = false;
//     async function loadAll() {
//       setLoading(true);
//       try {
//         const [hs, us, ds, ps] = await Promise.all([
//           asPromise(api.listHospitals()),
//           asPromise(api.listUsers()),
//           asPromise(api.listDoctors()),
//           asPromise(
//             api.listPatients ? api.listPatients() : Promise.resolve([])
//           ),
//         ]);
//         if (!cancelled) {
//           setHospitals(hs || []);
//           setUsers(us || []);
//           setDoctors(ds || []);
//           setPatients(ps || []);
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load admin data");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }
//     loadAll();
//     return () => (cancelled = true);
//   }, []);

//   const addHospital = async () => {
//     const trimmed = name.trim();
//     if (!trimmed) return setError("Hospital name required");
//     setError("");
//     try {
//       await asPromise(api.createHospital(trimmed)); // apiAdmin.createHospital -> apiHospital.add
//       const hs = await asPromise(api.listHospitals());
//       setHospitals(hs);
//       setName("");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to add hospital");
//     }
//   };

//   return (
//     <div className="grid">
//       <div className="card pad">
//         <h2>Admin Dashboard</h2>
//         {loading ? (
//           <div>Loading counts...</div>
//         ) : (
//           <div className="row" style={{ gap: 16 }}>
//             <div className="card pad">
//               <strong>{users.length}</strong>
//               <div>Accounts (NRI / hospital / doctor)</div>
//             </div>
//             <div className="card pad">
//               <strong>{hospitals.length}</strong>
//               <div>Hospitals</div>
//             </div>
//             <div className="card pad">
//               <strong>{doctors.length}</strong>
//               <div>Doctors</div>
//             </div>
//             <div className="card pad">
//               <strong>{patients.length}</strong>
//               <div>Patients / Elders</div>
//             </div>
//           </div>
//         )}

//         <hr style={{ margin: "16px 0" }} />
//         <h3>Onboard Hospital</h3>
//         <div className="row">
//           <input
//             className="input"
//             placeholder="Hospital name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <button className="btn" onClick={addHospital}>
//             Add
//           </button>
//         </div>
//         {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
//       </div>

//       <div className="card pad">
//         <h3>Quick links</h3>
//         <div className="row" style={{ flexDirection: "column" }}>
//           <a href="/admin/users" className="btn">
//             Manage Users
//           </a>
//           <a href="/admin/patients" className="btn">
//             Manage Patients
//           </a>
//           <a href="/admin/doctors" className="btn">
//             Manage Doctors
//           </a>
//           <a href="/admin/hospitals" className="btn">
//             Hospitals
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }
