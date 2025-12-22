import React, { useEffect, useState } from "react";
import { apiHospital } from "../../lib/fakeApi";

export default function AdminPatients() {
  // aggregate elders under all hospitals
  // (we reuse apiHospital.elders(h_id) across every hospital)
  const [hospitals, sethospital] = useState([]);
  useEffect(() => {
    let alive = true;
    async function loadhosp() {
      try {
        const res = await apiHospital.list();
        if (alive) sethospital(res || []);
      } catch (e) {
        if (alive) sethospital([]);
      }
    }
    loadhosp();
    return () => {
      alive = false;
    };
  }, []);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   let alive = true;
  //   async function fetchrow() {
  //     try {
  //       const r = hospitals.map(
  //         async (h) =>
  //           await apiHospital
  //             .elders(h._id)
  //             .map((e) => ({ ...e, hospitalName: h.name }))
  //       );
  //       if (alive) setrows(r);
  //       return;
  //     } catch (e) {
  //       if (alive) setrows([]);
  //       return;
  //     }
  //   }
  //   // const r = hospitals.flatMap(
  //   //   async (h) =>
  //   //     await apiHospital
  //   //       .elders(h._id)
  //   //       .map((e) => ({ ...e, hospitalName: h.name }))
  //   // );
  //   // setrows(r);
  //   fetchrow();
  //   return () => {
  //     alive = false;
  //   };
  // }, [hospitals]);
  useEffect(() => {
    let alive = true;

    async function loadPatients() {
      if (hospitals.length === 0) {
        setRows([]);
        setLoading(false);
        return;
      }

      try {
        console.log(hospitals);
        const allPatients = await Promise.all(
          hospitals.map(async (h) => {
            const elders = await apiHospital.elders(h._id);
            return elders.map((e) => ({
              ...e,
              hospitalName: h.name,
            }));
          })
        );

        if (alive) {
          setRows(allPatients.flat());
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to load patients", e);
        if (alive) {
          setRows([]);
          setLoading(false);
        }
      }
    }

    loadPatients();
    return () => (alive = false);
  }, [hospitals]);
  return (
    <div className="card pad">
      <h3>All Patients</h3>
      {rows && rows.length === 0 ? (
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
            {rows &&
              rows.map((x) => (
                <tr key={x._id}>
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
