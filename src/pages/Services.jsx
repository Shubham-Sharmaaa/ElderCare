// import React from "react";

// export default function Services() {
//   const caregivers = [
//     {
//       name: "Neha Sharma",
//       specialty: "Nursing",
//       rating: "4.8",
//       city: "Patiala",
//     },
//     {
//       name: "Ravi Verma",
//       specialty: "Physiotherapy",
//       rating: "4.6",
//       city: "Chandigarh",
//     },
//     {
//       name: "Anita Joshi",
//       specialty: "Geriatric Care",
//       rating: "5.0",
//       city: "Ludhiana",
//     },
//   ];

//   return (
//     <div className="main-content">
//       <div className="card">
//         <h2>Verified Home Caregivers</h2>
//         <ul>
//           {caregivers.map((c, i) => (
//             <li key={i}>
//               👤 <b>{c.name}</b> — {c.specialty} | ⭐ {c.rating} | 📍 {c.city}
//               <br />
//               <button
//                 className="button"
//                 onClick={() => alert(`Service booked with ${c.name}`)}
//               >
//                 Book Home Visit
//               </button>
//               <hr />
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
import React from "react";
export default function Services() {
  return (
    <div className="card pad">
      <h3>Services</h3>
      <ul>
        <li>Remote vitals streaming from Watch (simulated)</li>
        <li>Doctor appointments & reports</li>
        <li>Medication adherence & reminders</li>
      </ul>
    </div>
  );
}
