// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { apiElders, apiHospital } from "../lib/fakeApi";

// export default function Patients() {
//   const { user } = useAuth();
//   const [list, setList] = useState([]);
//   const [hospitals, setHospitals] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     age: "",
//     condition: "",
//     notes: "",
//     hospitalId: "",
//   });

//   useEffect(() => {
//     setHospitals(apiHospital.all());
//     setList(apiElders.listByOwner(user.id));
//   }, [user.id]);

//   const add = () => {
//     if (!form.name || !form.hospitalId) return;
//     apiElders.create({
//       ownerId: user.id,
//       name: form.name,
//       age: Number(form.age) || null,
//       condition: form.condition,
//       notes: form.notes,
//       hospitalId: form.hospitalId,
//     });
//     setList(apiElders.listByOwner(user.id));
//     setForm({ name: "", age: "", condition: "", notes: "", hospitalId: "" });
//   };

//   return (
//     <div className="card">
//       <h2>Manage Elders</h2>

//       <div className="grid2">
//         <input
//           className="form-input"
//           placeholder="Name"
//           value={form.name}
//           onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
//         />
//         <input
//           className="form-input"
//           placeholder="Age"
//           value={form.age}
//           onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
//         />
//       </div>

//       <div className="grid2">
//         <input
//           className="form-input"
//           placeholder="Condition"
//           value={form.condition}
//           onChange={(e) =>
//             setForm((f) => ({ ...f, condition: e.target.value }))
//           }
//         />
//         <select
//           className="form-input"
//           value={form.hospitalId}
//           onChange={(e) =>
//             setForm((f) => ({ ...f, hospitalId: e.target.value }))
//           }
//         >
//           <option value="">Select Hospital</option>
//           {hospitals.map((h) => (
//             <option key={h.id} value={h.id}>
//               {h.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <textarea
//         className="form-input"
//         placeholder="Notes"
//         value={form.notes}
//         onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
//       />

//       <button className="button" onClick={add}>
//         Add
//       </button>

//       <div className="card" style={{ marginTop: "1rem" }}>
//         <h3>My Elders</h3>
//         <ul>
//           {list.map((e) => (
//             <li key={e.id}>
//               <b>{e.name}</b> — {e.age || "—"} yrs — {e.condition || "—"}
//             </li>
//           ))}
//           {!list.length && <i>No elders yet.</i>}
//         </ul>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { usePatients } from "../context/PatientContext";

export default function Patients() {
  const {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    selectedPatientId,
    setSelectedPatientId,
  } = usePatients();
  const [form, setForm] = useState({
    name: "",
    age: "",
    condition: "",
    notes: "",
  });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    addPatient(form);
    setForm({ name: "", age: "", condition: "", notes: "" });
  };

  return (
    <div className="card">
      <h2>Manage Patients</h2>
      <form onSubmit={submit} className="form-row">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <input
          placeholder="Condition"
          value={form.condition}
          onChange={(e) => setForm({ ...form, condition: e.target.value })}
        />
        <input
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button className="button">Add</button>
      </form>

      <ul>
        {patients.map((p) => (
          <li key={p.id} style={{ margin: "8px 0" }}>
            <label>
              <input
                type="radio"
                checked={selectedPatientId === p.id}
                onChange={() => setSelectedPatientId(p.id)}
              />{" "}
              <b>{p.name}</b> · {p.age} yrs — {p.condition}
            </label>
            <div style={{ display: "inline-flex", gap: 8, marginLeft: 12 }}>
              <button
                className="button"
                onClick={() =>
                  updatePatient(p.id, { notes: (p.notes || "") + " ✓" })
                }
              >
                Quick Edit
              </button>
              <button
                className="button outline"
                onClick={() => deletePatient(p.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {patients.length === 0 && <i>No patients yet. Add one above.</i>}
      </ul>
    </div>
  );
}
