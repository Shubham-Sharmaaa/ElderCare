import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DoctorLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      {/* Top bar */}
      <header className="navbar">
        <div>WellNest (Doctor)</div>
        <div className="row" style={{ alignItems: "center", gap: 12 }}>
          <span className="muted">
            Signed in as <b>{user?.name || "—"}</b>
          </span>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="kv" style={{ marginBottom: 10 }}>
          <div>
            <b>Doctor:</b> {user?.name || "—"}
          </div>
          <div>
            <b>Hospital:</b> {user?.hospitalName || "—"}
          </div>
        </div>

        <NavLink
          to="/doctor"
          end
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          Home
        </NavLink>

        <NavLink
          to="/doctor/patients"
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          Patients
        </NavLink>

        <div style={{ marginTop: "auto" }}>
          <button
            className="btn ghost"
            style={{ width: "100%" }}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
// import React from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// export default function DoctorLayout() {
//   const { user, logout } = useAuth();

//   return (
//     <div className="app">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="brand">
//           <div className="muted">Signed in as</div>
//           <div style={{ fontWeight: 700, fontSize: 18 }}>{user?.name}</div>
//           <div className="muted">Hospital: {user?.hospitalName || "—"}</div>
//         </div>

//         <nav>
//           <NavLink
//             end
//             to="/doctor"
//             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
//           >
//             Home
//           </NavLink>
//           <NavLink
//             to="/doctor/patients"
//             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
//           >
//             Patients
//           </NavLink>
//         </nav>

//         <div className="logout">
//           <button
//             onClick={logout}
//             className="btn ghost"
//             style={{ width: "100%", color: "#3730a3" }}
//           >
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="main">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
// import React from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// export default function DoctorLayout() {
//   const { user, logout } = useAuth();

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-72 bg-brand-800 text-white flex flex-col">
//         <div className="px-5 py-5 border-b border-white/10">
//           <div className="text-sm text-white/70">Signed in as</div>
//           <div className="font-semibold text-lg">{user?.name}</div>
//           <div className="text-sm text-white/70">
//             Hospital: {user?.hospitalName || "—"}
//           </div>
//         </div>

//         <nav className="flex-1 p-3 space-y-1">
//           <NavItem to="/doctor" label="Home" />
//           <NavItem to="/doctor/patients" label="Patients" />
//         </nav>

//         <div className="p-4 border-t border-white/10">
//           <button
//             onClick={logout}
//             className="btn w-full bg-white text-brand-800 hover:bg-gray-100"
//           >
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 p-6">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// function NavItem({ to, label }) {
//   return (
//     <NavLink
//       to={to}
//       end
//       className={({ isActive }) =>
//         [
//           "block px-4 py-2 rounded-md transition",
//           isActive ? "bg-brand-700" : "hover:bg-brand-700/60",
//         ].join(" ")
//       }
//     >
//       {label}
//     </NavLink>
//   );
// }
