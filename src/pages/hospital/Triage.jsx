import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  apiHospital,
  apiVitals,
  computeRiskFromVitals,
} from "../../lib/fakeApi";

export default function Triage() {
  const { user } = useAuth();
  const rows = apiHospital
    .elders(user.id)
    .map((e) => {
      const last = apiVitals.recent(e.id, 1)[0];
      const risk = computeRiskFromVitals(last);
      return { ...e, last, risk };
    })
    .sort((a, b) => b.risk - a.risk);

  const band = (r) => (r >= 5 ? "High" : r >= 3 ? "Moderate" : "Low");

  return (
    <div className="card pad">
      <h3>Triage Board</h3>
      {rows.length === 0 ? (
        <p>No linked patients.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Last Vitals</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td>
                  {x.name} — {x.condition}
                </td>
                <td>
                  {x.last
                    ? `HR ${x.last.hr}, SpO₂ ${x.last.spo2}, BP ${x.last.sys}/${x.last.dia}`
                    : "No data"}
                </td>
                <td>
                  <span className="badge">{band(x.risk)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
