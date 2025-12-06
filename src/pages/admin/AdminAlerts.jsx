import React, { useState } from "react";
import { apiAlerts } from "../../lib/fakeApi";

export default function AdminAlerts() {
  const [txt, setTxt] = useState("");
  const [list, setList] = useState(apiAlerts.all());

  const send = () => {
    if (!txt.trim()) return;
    apiAlerts.add("[ADMIN] " + txt.trim());
    setList(apiAlerts.all());
    setTxt("");
  };

  return (
    <div className="grid">
      <div className="card pad">
        <h3>Broadcast Alert</h3>
        <div className="row">
          <input
            className="input"
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
            placeholder="Message to all portals"
          />
          <button className="btn" onClick={send}>
            Send
          </button>
        </div>
      </div>
      <div className="card pad">
        <h3>All Alerts</h3>
        {list.length === 0 ? (
          <p>No alerts yet.</p>
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
