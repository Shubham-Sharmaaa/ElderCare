import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

import LiveVitalsSimulator from "../components/LiveVitalsSimulator";
// ...

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function HealthRecords() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "BP (systolic)",
        data: [120, 125, 118, 130, 122],
        borderColor: "blue",
      },
      {
        label: "Blood Sugar",
        data: [90, 100, 95, 105, 98],
        borderColor: "green",
      },
    ],
  };

  return (
    <>
      <div className="navbar">Health Records</div>

      <div className="sidebar">
        <a href="/dashboard">Dashboard</a>

        <a href="/health">Health Records</a>
        <a href="/appointments">Appointments</a>
      </div>
      <div className="main-content">
        <div className="card">
          <h2>Upload Medical Report</h2>
          <input
            type="file"
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
              background: "#fff",
            }}
            onChange={() => alert("📄 Report uploaded (simulated).")}
          />
        </div>
        <div className="card">
          <h2>Blood Pressure Graph</h2>
          <div className="chart-wrapper">
            <Line data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
