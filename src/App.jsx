// import React from "react";
// import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// import { AuthProvider, useAuth } from "./context/AuthContext";
// import ToastProvider from "./components/Toast";
// import { PatientProvider } from "./context/PatientContext";

// // Public
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import NotFound from "./pages/NotFound";

// // NRI
// import Layout from "./components/Layout";
// import Dashboard from "./pages/Dashboard";
// import HealthRecords from "./pages/HealthRecords";
// import Appointments from "./pages/Appointments";
// import PatientTimeline from "./pages/PatientTimeline";
// import Meds from "./pages/Meds";
// import RemediesAI from "./pages/RemediesAI";
// import Services from "./pages/Services";
// import About from "./pages/About";
// import LinkParent from "./pages/LinkParent";

// // Hospital
// import HospitalLayout from "./pages/hospital/HospitalLayout";
// import HospitalHome from "./pages/hospital/Home";
// import HospitalPatients from "./pages/hospital/Patients";
// import HospitalAlerts from "./pages/hospital/Alerts";
// import HospitalReports from "./pages/hospital/Reports";
// import HospitalStats from "./pages/hospital/Stats";
// import Triage from "./pages/hospital/Triage";
// import HospitalDoctors from "./pages/hospital/Doctors";
// // Doctor
// import DoctorLayout from "./pages/doctor/DoctorLayout";
// import DoctorHome from "./pages/doctor/Home";
// import DoctorPatients from "./pages/doctor/Patients";

// // Admin
// import AdminLogin from "./pages/AdminLogin";
// import AdminLayout from "./pages/admin/AdminLayout";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminUsers from "./pages/admin/Users";
// import AdminPatients from "./pages/admin/Patients";
// import AdminStats from "./pages/admin/AdminStats";
// import AdminAlerts from "./pages/admin/AdminAlerts";

// /** Simple role gate that never sets state (prevents update-depth loops) */
// function RoleGate({ allow }) {
//   const { user, loading } = useAuth();
//   if (loading) return <div className="page pad">Loading…</div>;
//   if (!user) return <Navigate to="/" replace />;
//   return allow.includes(user.role) ? <Outlet /> : <Navigate to="/" replace />;
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <ToastProvider>
//         <PatientProvider>
//           <Routes>
//             {/* Public */}
//             <Route path="/" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/admin-login" element={<AdminLogin />} />

//             {/* NRI area */}
//             <Route element={<RoleGate allow={["nri"]} />}>
//               <Route element={<Layout />}>
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/health" element={<HealthRecords />} />
//                 <Route path="/appointments" element={<Appointments />} />
//                 <Route path="/timeline" element={<PatientTimeline />} />
//                 <Route path="/meds" element={<Meds />} />
//                 <Route path="/remedies" element={<RemediesAI />} />
//                 <Route path="/services" element={<Services />} />
//                 <Route path="/about" element={<About />} />
//                 <Route path="/link-parent" element={<LinkParent />} />
//               </Route>
//             </Route>

//             {/* Hospital area */}
//             {/* <Route element={<RoleGate allow={["hospital"]} />}>
//               <Route path="/hospital" element={<HospitalLayout />}>
//                 <Route index element={<HospitalHome />} />
//                 <Route path="patients" element={<HospitalPatients />} />
//                 <Route path="alerts" element={<HospitalAlerts />} />
//                 <Route path="reports" element={<HospitalReports />} />
//                 <Route path="stats" element={<HospitalStats />} />
//                 <Route path="triage" element={<Triage />} />
//               </Route>
//             </Route> */}
//             <Route path="/hospital" element={<HospitalLayout />}>
//               <Route index element={<HospitalHome />} />
//               <Route path="patients" element={<HospitalPatients />} />
//               + <Route path="doctors" element={<HospitalDoctors />} />
//               <Route path="alerts" element={<HospitalAlerts />} />
//               <Route path="reports" element={<HospitalReports />} />
//               <Route path="stats" element={<HospitalStats />} />
//               <Route path="triage" element={<Triage />} />
//             </Route>

//             {/* Doctor area */}
//             {/* <Route element={<RoleGate allow={["doctor"]} />}>
//               {/* <Route path="/doctor" element={<DoctorLayout />}>
//                 <Route index element={<DoctorHome />} />
//                 <Route path="patients" element={<DoctorPatients />} />
//               </Route>
//               <Route path="/doctor" element={<DoctorLayout />}>
//                 <Route
//                   index
//                   element={
//                     <RoleGate allow={["doctor"]}>
//                       <DoctorHome />
//                     </RoleGate>
//                   }
//                 />
//                 <Route
//                   path="patients"
//                   element={
//                     <RoleGate allow={["doctor"]}>
//                       <DoctorPatients />
//                     </RoleGate>
//                   }
//                 />
//               </Route>
//             </Route> */}
//             <Route path="/doctor" element={<DoctorLayout />}>
//               <Route
//                 index
//                 element={
//                   <RoleGate allow={["doctor"]}>
//                     <DoctorHome />
//                   </RoleGate>
//                 }
//               />
//               <Route
//                 path="patients"
//                 element={
//                   <RoleGate allow={["doctor"]}>
//                     <DoctorPatients />
//                   </RoleGate>
//                 }
//               />
//             </Route>
//             {/* Admin area */}
//             <Route element={<RoleGate allow={["admin"]} />}>
//               <Route path="/admin" element={<AdminLayout />}>
//                 <Route index element={<AdminDashboard />} />
//                 <Route path="users" element={<AdminUsers />} />
//                 <Route path="patients" element={<AdminPatients />} />
//                 <Route path="stats" element={<AdminStats />} />
//                 <Route path="alerts" element={<AdminAlerts />} />
//               </Route>
//             </Route>

//             {/* Fallback */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </PatientProvider>
//       </ToastProvider>
//     </AuthProvider>
//   );
// }
// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { PatientProvider } from "./context/PatientContext";
import ToastProvider from "./components/Toast";

/* Public */
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

/* NRI */
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import HealthRecords from "./pages/HealthRecords";
import Appointments from "./pages/Appointments";
import PatientTimeline from "./pages/PatientTimeline";
import Meds from "./pages/Meds";
import RemediesAI from "./pages/RemediesAI";
import Services from "./pages/Services";
import About from "./pages/About";
import LinkParent from "./pages/LinkParent";

/* Hospital */
import HospitalLayout from "./pages/hospital/HospitalLayout";
import HospitalHome from "./pages/hospital/Home";
import HospitalPatients from "./pages/hospital/Patients";
import HospitalDoctors from "./pages/hospital/Doctors";
import HospitalAlerts from "./pages/hospital/Alerts";
import HospitalReports from "./pages/hospital/Reports";
import HospitalStats from "./pages/hospital/Stats";
import Triage from "./pages/hospital/Triage";

/* Doctor */
import DoctorLayout from "./pages/doctor/DoctorLayout";
import DoctorHome from "./pages/doctor/Home";
import DoctorPatients from "./pages/doctor/Patients";

/* Admin */
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminPatients from "./pages/admin/Patients";
import AdminStats from "./pages/admin/AdminStats";
import AdminAlerts from "./pages/admin/AdminAlerts";

/** Tiny role gate that never sets state (prevents update‑depth loops). */
function RoleGate({ allow }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page pad">Loading…</div>;
  if (!user) return <Navigate to="/" replace />;
  return allow.includes(user.role) ? <Outlet /> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <PatientProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* NRI area */}
            <Route element={<RoleGate allow={["nri"]} />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/health" element={<HealthRecords />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/timeline" element={<PatientTimeline />} />
                <Route path="/meds" element={<Meds />} />
                <Route path="/remedies" element={<RemediesAI />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/link-parent" element={<LinkParent />} />
              </Route>
            </Route>

            {/* Hospital area */}
            <Route element={<RoleGate allow={["hospital"]} />}>
              <Route path="/hospital" element={<HospitalLayout />}>
                <Route index element={<HospitalHome />} />
                <Route path="patients" element={<HospitalPatients />} />
                <Route path="doctors" element={<HospitalDoctors />} />
                <Route path="alerts" element={<HospitalAlerts />} />
                <Route path="reports" element={<HospitalReports />} />
                <Route path="stats" element={<HospitalStats />} />
                <Route path="triage" element={<Triage />} />
              </Route>
            </Route>

            {/* Doctor area */}
            <Route element={<RoleGate allow={["doctor"]} />}>
              <Route path="/doctor" element={<DoctorLayout />}>
                <Route index element={<DoctorHome />} />
                <Route path="patients" element={<DoctorPatients />} />
              </Route>
            </Route>

            {/* Admin area */}
            <Route element={<RoleGate allow={["admin"]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="patients" element={<AdminPatients />} />
                <Route path="stats" element={<AdminStats />} />
                <Route path="alerts" element={<AdminAlerts />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PatientProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
