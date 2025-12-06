import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  return (
    <div style={{ display: "flex" }}>
      <aside className="aside">
        <div style={{ fontWeight: 700, margin: "6px 6px 12px" }}>
          Admin Console
        </div>
        <NavLink to="/admin">Dashboard</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/patients">Patients</NavLink>
        <NavLink to="/admin/stats">Stats</NavLink>
        <NavLink to="/admin/alerts">Alerts</NavLink>
        <div style={{ marginTop: 16 }}>
          <button className="btn ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1 }}>
        <div className="topbar">
          <div>Admin</div>
        </div>
        <div className="page pad">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
