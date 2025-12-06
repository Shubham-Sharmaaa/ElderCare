import React from "react";
import { apiHospital, apiAdmin } from "../../lib/fakeApi";

export default function AdminStats() {
  const hospitals = apiHospital.list();
  const users = apiAdmin.listUsers();
  const totalDoctors = users.filter((u) => u.role === "doctor").length;
  const totalNRIs = users.filter((u) => u.role === "nri").length;

  return (
    <div className="grid two">
      <div className="card pad">
        <div className="kpi">{hospitals.length}</div>
        <div>Hospitals</div>
      </div>
      <div className="card pad">
        <div className="kpi">{totalDoctors}</div>
        <div>Doctors</div>
      </div>
      <div className="card pad">
        <div className="kpi">{totalNRIs}</div>
        <div>NRI Users</div>
      </div>
      <div className="card pad">
        <div className="kpi">{users.length}</div>
        <div>Total Accounts</div>
      </div>
    </div>
  );
}
