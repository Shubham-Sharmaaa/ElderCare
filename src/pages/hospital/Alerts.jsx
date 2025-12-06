import React, { useState } from "react";
import { apiAlerts } from "../../lib/fakeApi";

export default function HospitalAlerts() {
  const [msg, setMsg] = useState("");
  const [list, setList] = useState(apiAlerts.all());

  const send = () => {
    if (!msg.trim()) return;
    apiAlerts.add("[HOSPITAL] " + msg.trim());
    setList(apiAlerts.all());
    setMsg("");
  };

  return (
    <div className="grid">
      <div className="card pad">
        <h3>Send Alert to System</h3>
        <div className="row">
          <input
            className="input"
            placeholder="e.g., ER overload, oxygen low"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button className="btn" onClick={send}>
            Send
          </button>
        </div>
      </div>
      <div className="card pad">
        <h3>All Alerts</h3>
        {list.length === 0 ? (
          <p>No alerts.</p>
        ) : (
          list.map((a) => (
            <div key={a.id}>
              {new Date(a.tsISO).toLocaleString()} — {a.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
