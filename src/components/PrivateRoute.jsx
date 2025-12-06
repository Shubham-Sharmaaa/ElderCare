// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function PrivateRoute({ children }) {
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//   return isLoggedIn ? children : <Navigate to="/" />;
// }
// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function PrivateRoute({ roles, children }) {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
//   if (!user) return <Navigate to="/" replace state={{ from: location }} />;
//   if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

//   return children;
// }
// src/components/PrivateRoute.jsx
// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a tiny spinner

  // not logged in → go to login
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // role mismatch → kick to login (or a 403 page if you have one)
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // OK → render nested routes
  return <Outlet />;
}
