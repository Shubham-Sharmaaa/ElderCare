import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiElders, apiVitals, apiReports } from "../../lib/fakeApi";

export default function DoctorHome() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    async function loadDoctorElders(doctorId) {
      try {
        const res = await fetch(
          `/api/elders?doctorId=${encodeURIComponent(doctorId)}`
        );
        if (!res.ok) throw new Error("API error");
        return await res.json();
      } catch (err) {
        console.warn(
          "[doctor] backend failed, fallback to fakeApi:",
          err?.message
        );
        console.log(
          "Fallback to local apiElders.listByDoctor for doctorId:",
          doctorId
        );
        return apiElders.listByDoctor(doctorId); // local
      }
    }
    loadDoctorElders(user.id).then(setPatients);
  }, [user?.id]);
  // console.log(patients);
  useEffect(() => {
    if (!user?.hospitalId) return;
    const myIds = new Set(
      (apiElders.listByDoctor(user.id) || []).map((e) => e.id)
    );
    const allForHospital = apiReports.listForHospital(user.hospitalId);
    setPendingReports(
      allForHospital.filter(
        (r) => myIds.has(r.elderId) && r.status === "pending"
      )
    );
  }, [user?.id, user?.hospitalId]);

  const alertsNow = useMemo(() => {
    let n = 0;
    patients.forEach((p) => {
      const last = (apiVitals.recent(p.id, 1) || [])[0];
      if (
        last &&
        (last.spo2 < 93 || last.sys >= 140 || last.dia >= 90 || last.hr >= 110)
      )
        n++;
    });
    return n;
  }, [patients]);

  return (
    <div className="page">
      <h1 className="page-title">Welcome, {user?.name}</h1>

      <div className="grid-3" style={{ marginBottom: 16 }}>
        <StatCard label="Assigned Patients" value={patients.length} />
        <StatCard label="Pending Reports" value={pendingReports.length} />
        <StatCard label="High‑Risk Alerts (Latest Vitals)" value={alertsNow} />
      </div>

      <div className="card">
        <h3 className="section-title">Your Patients</h3>
        {patients.length === 0 ? (
          <div className="muted">No assigned patients yet.</div>
        ) : (
          <ul className="grid-2">
            {patients.map((p) => (
              <li key={p.id} className="card" style={{ margin: 0 }}>
                <div className="kv">
                  <b>{p.name}</b>
                </div>
                <div className="kv">
                  {p.age} yrs · {p.condition || "—"}
                </div>
                <a
                  className="btn btn-pill"
                  href="/doctor/patients"
                  style={{ marginTop: 10, float: "right" }}
                >
                  Manage →
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card">
      <div className="muted">{label}</div>
      <div className="kpi">{value}</div>
    </div>
  );
}
// import React, { useEffect, useMemo, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { apiElders, apiVitals, apiReports } from "../../lib/fakeApi";

// export default function DoctorHome() {
//   const { user } = useAuth();
//   const [patients, setPatients] = useState([]);
//   const [pendingReports, setPendingReports] = useState([]);

//   useEffect(() => {
//     if (!user?.id) return;
//     setPatients(apiElders.listByDoctor(user.id) || []);
//   }, [user?.id]);

//   useEffect(() => {
//     if (!user?.hospitalId) return;
//     const myIds = new Set(
//       (apiElders.listByDoctor(user.id) || []).map((e) => e.id)
//     );
//     const allForHospital = apiReports.listForHospital(user.hospitalId);
//     setPendingReports(
//       allForHospital.filter(
//         (r) => myIds.has(r.elderId) && r.status === "pending"
//       )
//     );
//   }, [user?.id, user?.hospitalId]);

//   const totalAlertsToday = useMemo(() => {
//     let n = 0;
//     patients.forEach((p) => {
//       const last = (apiVitals.recent(p.id, 1) || [])[0];
//       if (
//         last &&
//         (last.spo2 < 93 || last.sys >= 140 || last.dia >= 90 || last.hr >= 110)
//       )
//         n++;
//     });
//     return n;
//   }, [patients]);

//   return (
//     <div>
//       <h1 className="h1">Welcome, {user?.name}</h1>

//       <div className="grid-3 mb-12">
//         <StatCard label="Assigned Patients" value={patients.length} />
//         <StatCard label="Pending Reports" value={pendingReports.length} />
//         <StatCard
//           label="High‑Risk Alerts (Latest Vitals)"
//           value={totalAlertsToday}
//         />
//       </div>

//       <div className="card">
//         <h2 style={{ fontWeight: 600, marginBottom: 12 }}>Your Patients</h2>
//         {patients.length === 0 ? (
//           <div className="text-muted">No assigned patients yet.</div>
//         ) : (
//           <ul style={{ display: "grid", gap: 10 }}>
//             {patients.map((p) => (
//               <li
//                 key={p.id}
//                 className="border rounded p-3 flex items-center justify-between"
//               >
//                 <div>
//                   <div style={{ fontWeight: 600 }}>{p.name}</div>
//                   <div className="text-muted" style={{ fontSize: 14 }}>
//                     {p.age} yrs · {p.condition || "—"}
//                   </div>
//                 </div>
//                 <a
//                   href="/doctor/patients"
//                   className="text-muted"
//                   style={{ color: "#4338ca", fontWeight: 600 }}
//                 >
//                   Manage →
//                 </a>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// function StatCard({ label, value }) {
//   return (
//     <div className="card stat">
//       <div className="label">{label}</div>
//       <div className="value">{value}</div>
//     </div>
//   );
// }
// import React, { useEffect, useMemo, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { apiElders, apiVitals, apiReports } from "../../lib/fakeApi";

// export default function DoctorHome() {
//   const { user } = useAuth();
//   const [patients, setPatients] = useState([]);
//   const [pendingReports, setPendingReports] = useState([]);

//   useEffect(() => {
//     if (!user?.id) return;
//     setPatients(apiElders.listByDoctor(user.id) || []);
//   }, [user?.id]);

//   useEffect(() => {
//     if (!user?.hospitalId) return;
//     const myIds = new Set(
//       (apiElders.listByDoctor(user.id) || []).map((e) => e.id)
//     );
//     const allForHospital = apiReports.listForHospital(user.hospitalId);
//     setPendingReports(
//       allForHospital.filter(
//         (r) => myIds.has(r.elderId) && r.status === "pending"
//       )
//     );
//   }, [user?.id, user?.hospitalId]);

//   const totalAlertsToday = useMemo(() => {
//     let n = 0;
//     patients.forEach((p) => {
//       const last = (apiVitals.recent(p.id, 1) || [])[0];
//       if (
//         last &&
//         (last.spo2 < 93 || last.sys >= 140 || last.dia >= 90 || last.hr >= 110)
//       )
//         n++;
//     });
//     return n;
//   }, [patients]);

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-semibold">Welcome, {user?.name}</h1>

//       <div className="grid gap-4 md:grid-cols-3">
//         <StatCard label="Assigned Patients" value={patients.length} />
//         <StatCard label="Pending Reports" value={pendingReports.length} />
//         <StatCard
//           label="High‑Risk Alerts (Latest Vitals)"
//           value={totalAlertsToday}
//         />
//       </div>

//       <div className="card">
//         <h2 className="font-semibold mb-3">Your Patients</h2>
//         {patients.length === 0 ? (
//           <div className="text-gray-600">No assigned patients yet.</div>
//         ) : (
//           <ul className="space-y-2">
//             {patients.map((p) => (
//               <li
//                 key={p.id}
//                 className="border rounded-lg p-3 flex items-center justify-between"
//               >
//                 <div>
//                   <div className="font-medium">{p.name}</div>
//                   <div className="text-sm text-gray-600">
//                     {p.age} yrs · {p.condition || "—"}
//                   </div>
//                 </div>
//                 <a
//                   href="/doctor/patients"
//                   className="text-brand-700 hover:underline text-sm"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   Manage →
//                 </a>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// function StatCard({ label, value }) {
//   return (
//     <div className="card">
//       <div className="text-gray-600 text-sm">{label}</div>
//       <div className="text-3xl font-semibold">{value}</div>
//     </div>
//   );
// }
