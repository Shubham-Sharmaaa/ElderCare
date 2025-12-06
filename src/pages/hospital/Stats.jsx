import React from "react";
import { useAuth } from "../../context/AuthContext";
import { apiHospital, apiReports } from "../../lib/fakeApi";

export default function HospitalStats() {
  const { user } = useAuth();
  const pts = apiHospital.elders(user.id);
  const reps = apiReports.listForHospital(user.id);
  const approved = reps.filter((r) => r.status === "approved").length;

  return (
    <div className="grid two">
      <div className="card pad">
        <div className="kpi">{pts.length}</div>
        <div>Patients</div>
      </div>
      <div className="card pad">
        <div className="kpi">{reps.length}</div>
        <div>Reports Uploaded</div>
      </div>
      <div className="card pad">
        <div className="kpi">{approved}</div>
        <div>Reports Approved</div>
      </div>
    </div>
  );
}
