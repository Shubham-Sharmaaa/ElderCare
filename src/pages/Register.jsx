import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { NavLink } from "react-router-dom";
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
    <div
      className="page pad"
      style={{
        maxWidth: 420,
        margin: "60px auto",
        background: "#ffffff",
        borderRadius: 18,
        border: "1px solid #E7EEF7",
        boxShadow: "0 12px 34px rgba(16,24,40,0.08)",
        padding: "28px 26px",
      }}
    >
      {/* Title */}
      <h2
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 800,
          color: "#0F172A",
          textAlign: "center",
        }}
      >
        Create NRI Account
      </h2>

      <div
        style={{
          marginTop: 6,
          fontSize: 13,
          color: "#64748B",
          textAlign: "center",
        }}
      >
        Register to manage your parents’ care remotely
      </div>

      {/* Form */}
      <form
        className="grid"
        onSubmit={submit}
        style={{
          marginTop: 22,
          display: "grid",
          gap: 14,
        }}
      >
        <input
          className="input"
          placeholder="Name"
          value={f.name}
          onChange={(e) => setF({ ...f, name: e.target.value })}
          style={{
            height: 46,
            width: "100%",
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            background: "#fff",
            padding: "0 14px",
            fontSize: 14,
            color: "#0F172A",
            outline: "none",
            boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
          }}
        />

        <input
          className="input"
          placeholder="Email"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          style={{
            height: 46,
            width: "100%",
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            background: "#fff",
            padding: "0 14px",
            fontSize: 14,
            color: "#0F172A",
            outline: "none",
            boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
          }}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
          style={{
            height: 46,
            width: "100%",
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            background: "#fff",
            padding: "0 14px",
            fontSize: 14,
            color: "#0F172A",
            outline: "none",
            boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
          }}
        />

        <button
          className="btn"
          style={{
            height: 46,
            borderRadius: 12,
            border: "1px solid #1D4ED8",
            background: "#1D4ED8",
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 12px 22px rgba(29,78,216,0.22)",
          }}
        >
          Create
        </button>
        <div
          style={{
            marginTop: 18,
            fontSize: 13,
            color: "#64748B",
            textAlign: "center",
          }}
        >
          Already a User?{" "}
          <NavLink
            to="/"
            style={{
              color: "#1D4ED8",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Login
          </NavLink>
        </div>
      </form>
    </div>
  );

  // return (
  //   <div className="page pad" style={{ maxWidth: 420 }}>
  //     <h2>Create NRI Account</h2>
  //     <form className="grid" onSubmit={submit}>
  //       <input
  //         className="input"
  //         placeholder="Name"
  //         value={f.name}
  //         onChange={(e) => setF({ ...f, name: e.target.value })}
  //       />
  //       <input
  //         className="input"
  //         placeholder="Email"
  //         value={f.email}
  //         onChange={(e) => setF({ ...f, email: e.target.value })}
  //       />
  //       <input
  //         className="input"
  //         type="password"
  //         placeholder="Password"
  //         value={f.password}
  //         onChange={(e) => setF({ ...f, password: e.target.value })}
  //       />
  //       <button className="btn">Create</button>
  //     </form>
  //   </div>
  // );
}
