import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div style={{ display: "flex" }}>
      <aside className="aside">
        <div style={{ fontWeight: 700, margin: "6px 6px 12px" }}>
          WellNest (NRI)
        </div>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/appointments">Appointments</NavLink>
        <NavLink to="/meds">Meds</NavLink>
        <NavLink to="/timeline">Timeline</NavLink>
        <NavLink to="/remedies">AI Remedies</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/about">About</NavLink>
        <div style={{ marginTop: 16 }}>
          <button className="btn ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1 }}>
        <div className="topbar">
          <div>
            Welcome, <span className="badge">{user?.name}</span>
          </div>
          <NavLink to="/link-parent" className="btn">
            Link Watch / Parent
          </NavLink>
        </div>
        <div className="page pad">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
