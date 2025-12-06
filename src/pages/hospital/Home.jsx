import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiHospital, apiAlerts } from "../../lib/fakeApi";

export default function HospitalHome() {
  const { user } = useAuth();
  const [pts, setPts] = React.useState([]);
  const docs = apiHospital.doctors(user.id);
  const alerts = apiAlerts.all();
  useEffect(() => {
    async function loadHospitalElders(hospitalId) {
      try {
        const res = await fetch(
          `/api/elders?hospitalId=${encodeURIComponent(hospitalId)}`
        );
        if (!res.ok) throw new Error("API error");
        return await res.json();
      } catch (err) {
        console.warn(
          "[hospital] backend failed, fallback to fakeApi:",
          err?.message
        );
        return apiHospital.elders(hospitalId); // old local behaviour
      }
    }
    let pt = loadHospitalElders(user.id);
    setPts(pt);
  }, [user.id]);
  return (
    <div className="grid two">
      <div className="card pad">
        <h3>Overview</h3>
        <div className="row">
          <div className="kpi">{pts.length}</div>
          <div>Registered Patients</div>
        </div>
        <div className="row">
          <div className="kpi">{docs.length}</div>
          <div>Doctors</div>
        </div>
      </div>
      <div className="card pad">
        <h3>Latest Alerts</h3>
        {alerts
          .slice(-5)
          .reverse()
          .map((a) => (
            <div key={a.id}>
              {new Date(a.tsISO).toLocaleString()} — {a.text}
            </div>
          ))}
        {alerts.length === 0 && <p>No alerts.</p>}
      </div>
    </div>
  );
}
