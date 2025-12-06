// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        background: "#f5f5f5",
      }}
    >
      <h1 style={{ fontSize: "4rem", color: "#1e3a8a" }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ marginBottom: "1rem" }}>
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link to="/" style={{ color: "#2563eb", fontWeight: "bold" }}>
        ⬅ Go back to Login
      </Link>
    </div>
  );
}
