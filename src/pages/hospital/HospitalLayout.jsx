// import React from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// export default function HospitalLayout() {
//   const { logout, user } = useAuth();

//   if (!user || user.role !== "hospital") {
//     return (
//       <div style={{ padding: 24 }}>
//         You’re not logged in as a hospital user.
//       </div>
//     );
//   }

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       {/* Sidebar */}
//       <aside className="aside">
//         <div style={{ fontWeight: 700, margin: "6px 6px 12px" }}>
//           Hospital: {user?.name}
//         </div>
//         <NavLink to="/hospital">Home</NavLink>
//         <NavLink to="/hospital/patients">Patients</NavLink>
//         <NavLink to="/hospital/triage">Triage</NavLink>
//         <NavLink to="/hospital/alerts">Alerts</NavLink>
//         <NavLink to="/hospital/reports">Reports</NavLink>
//         <NavLink to="/hospital/stats">Stats</NavLink>

//         <div style={{ marginTop: 16 }}>
//           <button className="btn ghost" onClick={logout}>
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <main style={{ flex: 1 }}>
//         <div className="topbar">
//           <div>Hospital Portal</div>
//           <div style={{ fontSize: "0.9em", opacity: 0.7 }}>
//             Hospital ID: {user.hospitalId || "—"}
//           </div>
//         </div>

//         <div className="page pad">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function HospitalLayout() {
  const { logout, user } = useAuth();

  if (!user || user.role !== "hospital") {
    return (
      <div style={{ padding: 24 }}>
        You’re not logged in as a hospital user.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside className="aside bg-blue-900 text-white w-60 p-4">
        <div className="font-bold mb-4">Hospital: {user?.name}</div>
        <NavLink
          className="block px-3 py-2 rounded hover:bg-blue-800"
          to="/hospital"
        >
          Home
        </NavLink>
        <NavLink
          className="block px-3 py-2 rounded hover:bg-blue-800"
          to="/hospital/patients"
        >
          Patients
        </NavLink>
        <NavLink
          className="block px-3 py-2 rounded hover:bg-blue-800"
          to="/hospital/doctors"
        >
          Doctors
        </NavLink>
        <NavLink
          className="block px-3 py-2 rounded hover:bg-blue-800"
          to="/hospital/triage"
        >
          Triage
        </NavLink>
        <NavLink
          className="block px-3 py-2 rounded hover:bg-blue-800"
          to="/hospital/alerts"
        >
          Alerts
        </NavLink>
        <NavLink
          className="block px-3 py-2 rounded hover:bg-blue-800"
          to="/hospital/reports"
        >
          Reports
        </NavLink>
        <NavLink
          className="block px-3 py-2 rounded hover:bg-blue-800"
          to="/hospital/stats"
        >
          Stats
        </NavLink>

        <div className="mt-6">
          <button
            className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <div className="topbar flex justify-between items-center p-4 bg-gray-100 border-b">
          <div className="font-semibold">Hospital Portal</div>
          <div className="text-sm text-gray-600">
            Hospital ID: {user.hospitalId || "—"}
          </div>
        </div>

        <div className="page pad p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
