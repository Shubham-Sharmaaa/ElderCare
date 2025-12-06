import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import { useToast } from "../components/Toast";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      toast(err.message || "Login failed");
    }
  };

  return (
    <div className="page pad" style={{ maxWidth: 420 }}>
      <h2>WellNest Login</h2>
      <form className="grid" onSubmit={submit}>
        <input
          className="input"
          placeholder="Email (e.g., nri@demo.io, admin@wellnest.io, patel@fortis.example, fortis@hospital.demo)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password (required for NRI/Admin)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn">Login</button>
      </form>
      <div style={{ marginTop: 12 }}>
        New NRI? <NavLink to="/register">Create account</NavLink>
      </div>
    </div>
  );
}
