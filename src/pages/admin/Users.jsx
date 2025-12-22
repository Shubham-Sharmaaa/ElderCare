import React, { useEffect } from "react";
import { apiAdmin } from "../../lib/fakeApi";

export default function Users() {
  const [list, setlist] = useState([]);
  useEffect(() => {
    async function fetchtotal() {
      try {
        const res = await apiAdmin.listUsers();
        if (res) setlist(res);
        return;
      } catch (e) {
        console.log(e);
        return;
      }
    }
    fetchtotal();
  }, []);

  return (
    <div className="card pad">
      <h3>All Accounts</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {list.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// src/admin/Users.jsx

// src/admin/Users.jsx
// import React, { useEffect, useState } from "react";
// import { apiAdmin, apiElders, apiHospital } from "../../lib/fakeApi";

// export default function UsersAdmin() {
//   const api = apiAdmin;
//   const [users, setUsers] = useState([]);
//   const [hospitals, setHospitals] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [newUserName, setNewUserName] = useState("");
//   const [newUserEmail, setNewUserEmail] = useState("");
//   const [newElderName, setNewElderName] = useState("");
//   const [newElderHospital, setNewElderHospital] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let cancelled = false;
//     async function load() {
//       setLoading(true);
//       try {
//         const [us, hs] = await Promise.all([
//           api.listUsers(), // sync in fakeapi
//           api.listHospitals(),
//         ]);
//         if (!cancelled) {
//           setUsers(us || []);
//           setHospitals(hs || []);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }
//     load();
//     return () => (cancelled = true);
//   }, []);

//   const createUser = async () => {
//     if (!newUserName.trim() || !newUserEmail.trim())
//       return setError("Name and email required");
//     setError("");
//     try {
//       // fakeapi.apiAuth.registerNri exists, but admin create flow uses apiAdmin? We'll use apiAdmin.createUser if present
//       // apiAdmin in fakeapi returns a listUsers + createHospital + addDoctor only.
//       // We'll use apiElders' underlying DB via apiAdmin.create? fallback to apiAdmin exposing admin createUser not present.
//       // For now create via apiAdmin isn't available — use the global db by calling apiAdmin.createUser if implemented.
//       // Since fakeapi doesn't expose createUser on apiAdmin, use apiAdmin.build-through apiAdmin? fallback: use apiAdmin.createHospital?
//       // Safer: call apiAdmin.__createUser via apiAdmin portal isn't present. We'll use apiAdmin as list + then direct route: use window.localStorage update via apiAdmin not provided.
//       // But to avoid changing fakeapi, rely on apiAuth.registerNri — it's exported in fakeapi as apiAuth.
//       // import it:
//     } catch (err) {
//       console.error(err);
//       setError("Failed to create user");
//     }
//   };

//   // Since fakeapi exposes apiAuth.registerNri, let's import it dynamically to create NRI accounts
//   useEffect(() => {
//     // nothing here; createUser will call apiAuth
//   }, []);

//   // createUser implementation using apiAuth.registerNri
//   const createUser_real = async () => {
//     if (!newUserName.trim() || !newUserEmail.trim())
//       return setError("Name and email required");
//     setError("");
//     try {
//       // import apiAuth from same module
//       const mod = await import("../../lib/fakeApi");
//       await mod.apiAuth.registerNri({
//         name: newUserName.trim(),
//         email: newUserEmail.trim(),
//         password: "pass", // default demo password; admin can set real flow later
//       });
//       const us = mod.apiAdmin.listUsers();
//       setUsers(us);
//       setNewUserName("");
//       setNewUserEmail("");
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to create user");
//     }
//   };

//   const selectUser = (u) => {
//     setSelectedUser(u);
//   };

//   const addElder = async () => {
//     if (!selectedUser) return setError("Select user");
//     if (!newElderName.trim()) return setError("Elder name required");
//     setError("");
//     try {
//       await apiElders.create({
//         ownerId: selectedUser.id,
//         name: newElderName.trim(),
//         age: 0,
//         hospitalId: newElderHospital || null,
//         conditions: [],
//         notes: "",
//       });
//       setNewElderName("");
//       setNewElderHospital("");
//       // no need to refresh global users list; elders show from UserEldersList which reads from apiElders
//     } catch (err) {
//       console.error(err);
//       setError("Failed to add elder");
//     }
//   };

//   const deleteUser = async (u) => {
//     if (
//       !window.confirm(`Delete user ${u.name}? This will remove their elders.`)
//     )
//       return;
//     // fakeapi.apiAdmin doesn't have deleteUser; but fakeapi has db-level users removal via apiAuth? no
//     // There is apiAdmin.listUsers (synthetic) but no deleteUser exposed — fallback: remove via direct module mutation
//     try {
//       const mod = await import("../../lib/fakeApi");
//       // try calling apiAdmin.deleteUser if it exists
//       if (mod.apiAdmin.deleteUser) {
//         await mod.apiAdmin.deleteUser(u.id);
//       } else if (mod.apiAuth && mod.apiAuth.__deleteUser) {
//         // unlikely
//         await mod.apiAuth.__deleteUser(u.id);
//       } else {
//         // manual mutate: modify localStorage seed
//         const raw = localStorage.getItem("wn_db_v2");
//         if (raw) {
//           const state = JSON.parse(raw);
//           state.users = state.users.filter((x) => x.id !== u.id);
//           state.elders = state.elders.filter((e) => e.ownerId !== u.id);
//           localStorage.setItem("wn_db_v2", JSON.stringify(state));
//         }
//       }
//       // refresh users
//       const refreshed = (
//         await import("../../lib/fakeApi")
//       ).apiAdmin.listUsers();
//       setUsers(refreshed);
//       if (selectedUser?.id === u.id) setSelectedUser(null);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to delete user");
//     }
//   };

//   return (
//     <div className="grid">
//       <div className="card pad">
//         <h3>NRIs / Users</h3>
//         {loading ? (
//           <div>Loading users...</div>
//         ) : (
//           <ul>
//             {users.map((u) => (
//               <li key={u.id} className="row" style={{ alignItems: "center" }}>
//                 <div style={{ flex: 1 }}>
//                   <strong>{u.name}</strong>
//                   <br />
//                   <small>{u.email}</small>
//                 </div>
//                 <div style={{ display: "flex", gap: 8 }}>
//                   <button className="btn" onClick={() => selectUser(u)}>
//                     View elders
//                   </button>
//                   <button className="btn" onClick={() => deleteUser(u)}>
//                     Delete
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}

//         <hr />
//         <h4>Create NRI user</h4>
//         <input
//           className="input"
//           placeholder="Name"
//           value={newUserName}
//           onChange={(e) => setNewUserName(e.target.value)}
//         />
//         <input
//           className="input"
//           placeholder="Email"
//           value={newUserEmail}
//           onChange={(e) => setNewUserEmail(e.target.value)}
//         />
//         <button className="btn" onClick={createUser_real}>
//           Create user
//         </button>
//         {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
//       </div>

//       <div className="card pad">
//         <h3>
//           {selectedUser
//             ? `${selectedUser.name} — Elders`
//             : "Select a user to manage elders"}
//         </h3>
//         {selectedUser ? (
//           <>
//             <div>
//               <input
//                 className="input"
//                 placeholder="Elder name"
//                 value={newElderName}
//                 onChange={(e) => setNewElderName(e.target.value)}
//               />
//               <select
//                 className="input"
//                 value={newElderHospital}
//                 onChange={(e) => setNewElderHospital(e.target.value)}
//               >
//                 <option value="">Select hospital (optional)</option>
//                 {hospitals.map((h) => (
//                   <option key={h.id} value={h.id}>
//                     {h.name}
//                   </option>
//                 ))}
//               </select>
//               <button className="btn" onClick={addElder}>
//                 Add elder to user
//               </button>
//             </div>

//             <h4 style={{ marginTop: 12 }}>Elders list</h4>
//             <UserEldersList userId={selectedUser.id} />
//           </>
//         ) : (
//           <div>Select a user on the left</div>
//         )}
//       </div>
//     </div>
//   );
// }

// function UserEldersList({ userId }) {
//   const [elders, setElders] = useState([]);
//   useEffect(() => {
//     let cancelled = false;
//     function load() {
//       const list = apiElders.listByOwner(userId); // sync
//       if (!cancelled) setElders(list || []);
//     }
//     load();
//     // also listen for DB changes to update list when other admin actions occur
//     const handler = () => load();
//     window.addEventListener("wn:db", handler);
//     return () => {
//       cancelled = true;
//       window.removeEventListener("wn:db", handler);
//     };
//   }, [userId]);

//   if (!elders.length) return <div>No elders</div>;
//   return (
//     <ul>
//       {elders.map((e) => (
//         <li key={e.id} className="row" style={{ alignItems: "center" }}>
//           <div style={{ flex: 1 }}>
//             <strong>{e.name}</strong>
//             <br />
//             <small>Hospital: {e.hospitalId || "—"}</small>
//           </div>
//           <div style={{ display: "flex", gap: 8 }}>
//             <a className="btn" href={`/admin/patients?patient=${e.id}`}>
//               Open
//             </a>
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// }
