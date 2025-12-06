import React from "react";
import { apiHospital } from "../../lib/fakeApi";

export default function AdminPatients() {
  // aggregate elders under all hospitals
  // (we reuse apiHospital.elders(hId) across every hospital)
  const hospitals = apiHospital.list();
  const rows = hospitals.flatMap((h) =>
    apiHospital.elders(h.id).map((e) => ({ ...e, hospitalName: h.name }))
  );

  return (
    <div className="card pad">
      <h3>All Patients</h3>
      {rows.length === 0 ? (
        <p>No patients yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Condition</th>
              <th>Hospital</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td>{x.name}</td>
                <td>{x.age}</td>
                <td>{x.condition}</td>
                <td>{x.hospitalName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
