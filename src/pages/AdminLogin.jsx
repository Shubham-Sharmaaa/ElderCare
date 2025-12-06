import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="main-content">
      <div className="card" style={{ maxWidth: "400px", margin: "2rem auto" }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            className="form-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
