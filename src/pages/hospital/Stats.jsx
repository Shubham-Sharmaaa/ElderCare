import React, { use, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiHospital, apiReports } from "../../lib/fakeApi";

export default function HospitalStats() {
  const { user } = useAuth();
  // const pts = apiHospital.elders(user.id);
  const [pts, setPts] = React.useState([]);
  useEffect(() => {
    if (!user?.id) return;
    let alive = true;
    async function loadPatient() {
      try {
        const pts = await apiHospital.elders(user.id);
        if (alive) setPts(pts || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadPatient();
    return () => {
      alive = false;
    };
  }, [user?.id]);
  const [reps, setreps] = React.useState([]);
  useEffect(() => {
    if (!user?.id) return;
    let alive = true;
    async function loadReports() {
      try {
        const reports = await apiReports.listForHospital(user.id);
        if (alive) setreps(reports || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadReports();
    return () => {
      alive = false;
    };
  }, [user?.id]);
  // const reps = apiReports.listForHospital(user.id);
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
