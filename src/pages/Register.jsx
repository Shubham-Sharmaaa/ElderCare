import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(f);
    } catch (err) {
      toast(err.message || "Failed");
    }
  };
  return (
    <div className="page pad" style={{ maxWidth: 420 }}>
      <h2>Create NRI Account</h2>
      <form className="grid" onSubmit={submit}>
        <input
          className="input"
          placeholder="Name"
          value={f.name}
          onChange={(e) => setF({ ...f, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Email"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
        />
        <button className="btn">Create</button>
      </form>
    </div>
  );
}
