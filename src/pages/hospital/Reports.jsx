// import React, { useMemo, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { apiHospital, apiReports } from "../../lib/fakeApi";

// export default function HospitalReports() {
//   const { user } = useAuth();
//   const elders = useMemo(() => apiHospital.elders(user.id), [user.id]);
//   const [sel, setSel] = useState(elders[0]?.id || "");
//   const [title, setTitle] = useState("");
//   const [url, setUrl] = useState("");
//   const [rows, setRows] = useState(sel ? apiReports.listForElder(sel) : []);

//   const load = (id) => setRows(apiReports.listForElder(id));

//   const upload = () => {
//     if (!sel || !title.trim() || !url.trim()) return;
//     apiReports.upload({ elderId: sel, title: title.trim(), url: url.trim() });
//     setTitle("");
//     setUrl("");
//     load(sel);
//   };
//   const approve = (id) => {
//     apiReports.setStatus(id, "approved");
//     load(sel);
//   };

//   return (
//     <div className="grid">
//       <div className="card pad">
//         <h3>Upload Report</h3>
//         <div className="grid two">
//           <select
//             value={sel}
//             onChange={(e) => {
//               setSel(e.target.value);
//               load(e.target.value);
//             }}
//           >
//             {elders.map((e) => (
//               <option key={e._id} value={e._id}>
//                 {e.name}
//               </option>
//             ))}
//           </select>
//           <input
//             className="input"
//             placeholder="Title (e.g., CBC - Aug 25)"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//           <input
//             className="input"
//             placeholder="URL to PDF (or text)"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//           />
//         </div>
//         <div style={{ marginTop: 8 }}>
//           <button className="btn" onClick={upload} disabled={!sel}>
//             Upload
//           </button>
//         </div>
//       </div>

//       <div className="card pad">
//         <h3>Reports</h3>
//         {rows.length === 0 ? (
//           <p>No reports yet.</p>
//         ) : (
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Title</th>
//                 <th>Status</th>
//                 <th>Link</th>
//                 <th />
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((r) => (
//                 <tr key={r.id}>
//                   <td>{new Date(r.tsISO).toLocaleString()}</td>
//                   <td>{r.title}</td>
//                   <td>{r.status}</td>
//                   <td>
//                     <a href={r.url} target="_blank" rel="noreferrer">
//                       Open
//                     </a>
//                   </td>
//                   <td>
//                     {r.status !== "approved" && (
//                       <button className="btn" onClick={() => approve(r.id)}>
//                         Approve
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiHospital, apiReports } from "../../lib/fakeApi";

export default function HospitalReports() {
  const { user } = useAuth();

  const [elders, setElders] = useState([]);
  const [sel, setSel] = useState(""); // selected elderId
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [rows, setRows] = useState([]);
  const [loadingElders, setLoadingElders] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);

  // ---- load elders for this hospital ----
  useEffect(() => {
    let alive = true;

    async function loadElders() {
      try {
        setLoadingElders(true);
        console.log("[HospitalReports] loading elders for hospital:", user.id);
        const data = await apiHospital.elders(user.id); // async now
        if (!alive) return;

        const list = Array.isArray(data) ? data : [];
        setElders(list);

        if (list.length > 0) {
          const firstId = list[0].id ?? list[0]._id; // 👈 fallback to _id
          setSel((prev) => prev || firstId || "");
        } else {
          setSel("");
        }

        console.log("[HospitalReports] elders loaded:", list);
      } catch (err) {
        console.error("Failed to load elders:", err);
        if (alive) {
          setElders([]);
          setSel("");
        }
      } finally {
        if (alive) setLoadingElders(false);
      }
    }

    loadElders();
    return () => {
      alive = false;
    };
  }, [user.id]);

  // ---- load reports when selected elder changes ----
  useEffect(() => {
    if (!sel) {
      setRows([]);
      return;
    }

    let alive = true;
    setLoadingReports(true);
    console.log("[HospitalReports] loading reports for elder:", sel);

    apiReports
      .listForElder(sel)
      .then((data) => {
        if (!alive) return;
        const list = Array.isArray(data) ? data : [];
        console.log("[HospitalReports] reports loaded:", list);
        setRows(list);
      })
      .catch((err) => {
        console.error("Failed to load reports:", err);
        if (alive) setRows([]);
      })
      .finally(() => {
        if (alive) setLoadingReports(false);
      });

    return () => {
      alive = false;
    };
  }, [sel]);

  const upload = async () => {
    console.log("[HospitalReports] upload clicked", { sel, title, url });

    if (!sel || !title.trim() || !url.trim()) {
      console.warn("[HospitalReports] missing fields, cannot submit", {
        hasSel: !!sel,
        hasTitle: !!title.trim(),
        hasUrl: !!url.trim(),
      });
      return;
    }

    try {
      await apiReports.upload({
        elderId: sel,
        title: title.trim(),
        url: url.trim(),
      });
      console.log("[HospitalReports] upload done, reloading reports…");

      setTitle("");
      setUrl("");

      const updated = await apiReports.listForElder(sel);
      setRows(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error("Failed to upload report:", err);
    }
  };

  const approve = async (id) => {
    try {
      console.log("[HospitalReports] approving", id);
      await apiReports.setStatus(id, "approved");
      const updated = await apiReports.listForElder(sel);
      setRows(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error("Failed to approve report:", err);
    }
  };

  const isSubmitDisabled =
    !sel || !title.trim() || !url.trim() || loadingElders;
  console.log(
    "selecting elderId:",
    sel,
    "isSubmitDisabled:",
    isSubmitDisabled,
    " loadingElders:",
    loadingElders,
    " elders:",
    elders
  );
  return (
    <div className="grid">
      <div className="card pad">
        <h3>Upload Report</h3>

        {loadingElders && elders.length === 0 ? (
          <p>Loading elders…</p>
        ) : elders.length === 0 ? (
          <p>No elders found for this hospital.</p>
        ) : (
          <div className="grid two">
            <select
              value={sel}
              onChange={(e) => {
                console.log(
                  "[HospitalReports] elder changed to",
                  e.target.value
                );
                setSel(e.target.value);
              }}
            >
              {elders.map((e) => {
                const eid = e.id ?? e._id; // 👈 use id or _id
                return (
                  <option key={eid} value={eid}>
                    {e.name}
                  </option>
                );
              })}
            </select>

            <input
              className="input"
              placeholder="Title (e.g., CBC - Aug 25)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="input"
              placeholder="URL to PDF (or text)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        )}

        <div style={{ marginTop: 8 }}>
          <button className="btn" onClick={upload} disabled={isSubmitDisabled}>
            Upload
          </button>
        </div>
      </div>

      <div className="card pad">
        <h3>Reports</h3>

        {loadingReports ? (
          <p>Loading reports…</p>
        ) : rows.length === 0 ? (
          <p>No reports yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Status</th>
                <th>Link</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id}>
                  <td>{new Date(r.tsISO).toLocaleString()}</td>
                  <td>{r.title}</td>
                  <td>{r.status}</td>
                  <td>
                    <a href={r.url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </td>
                  <td>
                    {r.status !== "approved" && (
                      <button className="btn" onClick={() => approve(r._id)}>
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
