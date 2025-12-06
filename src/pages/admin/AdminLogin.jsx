import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function AdminLogin() {
  const { login } = useAuth();
  const toast = useToast();
  const [f, setF] = useState({
    email: "admin@wellnest.io",
    password: "admin123",
  });
  const submit = async (e) => {
    e.preventDefault();
    try {
      await login({ ...f, role: "admin" });
    } catch (err) {
      toast(err.message || "Failed");
    }
  };
  return (
    <div className="page pad" style={{ maxWidth: 420 }}>
      <h2>Admin Login</h2>
      <form className="grid" onSubmit={submit}>
        <input
          className="input"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
        <input
          className="input"
          type="password"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
        />
        <button className="btn">Login</button>
      </form>
    </div>
  );
}
