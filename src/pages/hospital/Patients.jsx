import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiElders, apiHospital } from "../../lib/fakeApi";

export default function HospitalPatients() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [assigning, setAssigning] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setErr("");

        if (!user?.hospitalId) {
          throw new Error("No hospitalId on current user.");
        }

        const list = await Promise.resolve(
          apiElders.listByHospital(user.hospitalId)
        );

        const docs = await Promise.resolve(
          apiHospital.doctors(user.hospitalId)
        );
        console.log("Loaded doctors for hospital:", docs);
        console.log("Loaded patients for hospital:", list);
        if (!mounted) return;
        setRows(list);
        setDoctors(docs);
      } catch (e) {
        if (mounted) setErr(e.message || "Failed to load patients");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [user?.hospitalId]);

  const handleAssign = async (elderId, doctorId) => {
    try {
      setAssigning(elderId);
      console.log("Assigning doctor", doctorId, "to elder", elderId);
      await Promise.resolve(apiHospital.assignDoctor(elderId, doctorId));
      // refresh local rows
      const updated = await Promise.resolve(
        apiElders.listByHospital(user.hospitalId)
      );
      setRows(updated);
    } catch (e) {
      alert(e.message || "Failed to assign doctor");
    } finally {
      setAssigning(null);
    }
  };

  if (loading) return <div>Loading patients…</div>;
  if (err) return <div className="text-red-600">Error: {err}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Patients registered to your hospital
      </h1>

      {rows.length === 0 ? (
        <div className="p-4 rounded bg-white shadow">No patients yet.</div>
      ) : (
        <div className="rounded bg-white shadow divide-y">
          {rows.map((e) => (
            <div key={e._id} className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-medium">
                  {e.name} <span className="text-gray-500">({e.age} yrs)</span>
                </div>
                <div className="text-sm text-gray-600">
                  Condition: {e.condition || "—"} · Notes: {e.notes || "—"}
                </div>
                <div className="text-sm text-gray-600">
                  Assigned doctor:{" "}
                  <b>
                    {doctors.find((d) => d.id === e.doctorId)?.name ||
                      "Unassigned"}
                  </b>
                </div>
              </div>

              <div>
                <label className="text-sm mr-2">Assign doctor:</label>
                <select
                  className="border rounded px-2 py-1"
                  value={e.doctorId || ""}
                  onChange={(ev) => handleAssign(e._id, ev.target.value)}
                  disabled={assigning === e._id}
                >
                  <option value="">— Select —</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
