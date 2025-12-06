import React, { useEffect, useMemo, useRef, useState } from "react";
import { apiVitals } from "../lib/fakeApi";
import { onVitals, onVitalsBC } from "../lib/fakeApi";
import { computeRiskFromVitals } from "../lib/fakeApi"; // you already have this helper

export default function LiveVitalsCard({ elderId }) {
  const [list, setList] = useState([]);

  const lastIdRef = useRef(list.slice(-1)[0]?.id || "");
  useEffect(() => {
    async function fetchVitals(elderId) {
      const res = await apiVitals.recent(elderId, 10);
      return res;
    }
    fetchVitals(elderId).then(setList);
  }, [elderId]);
  // subscribe to events
  useEffect(() => {
    const unsub1 = onVitals(elderId, (row) => {
      setList((prev) => {
        const next = [...prev, row].slice(-10);
        lastIdRef.current = row.id;
        return next;
      });
    });
    const unsub2 = onVitalsBC(elderId, (row) => {
      setList((prev) => {
        const next = [...prev, row].slice(-10);
        lastIdRef.current = row.id;
        return next;
      });
    });

    // polling fallback (in case events are missed)
    const id = setInterval(() => {
      const latest = apiVitals.recent(elderId, 1)[0];
      if (latest && latest.id !== lastIdRef.current) {
        setList((prev) => [...prev, latest].slice(-10));
        lastIdRef.current = latest.id;
      }
    }, 3000);

    return () => {
      unsub1?.();
      unsub2?.();
      clearInterval(id);
    };
  }, [elderId]);

  const last = list.slice(-1)[0];
  const risk = useMemo(() => computeRiskFromVitals(last), [last]);

  const riskBadge =
    risk >= 5
      ? "status status--rejected"
      : risk >= 3
      ? "status status--pending"
      : "status status--approved";

  return (
    <div className="card" style={{ marginTop: 10 }}>
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div className="section-title" style={{ margin: 0 }}>
          Live Vitals
        </div>
        <span className={riskBadge}>
          {risk >= 5 ? "High risk" : risk >= 3 ? "Moderate risk" : "Low risk"}
        </span>
      </div>

      {last ? (
        <>
          <div
            className="row"
            style={{ gap: 12, marginTop: 10, flexWrap: "wrap" }}
          >
            <div className="badge">
              HR <b>{last.hr}</b>
            </div>
            <div className="badge">
              SpO₂ <b>{last.spo2}%</b>
            </div>
            <div className="badge">
              BP{" "}
              <b>
                {last.sys}/{last.dia}
              </b>
            </div>
            <div className="kv">
              Updated: {new Date(last.tsISO).toLocaleTimeString()}
            </div>
          </div>

          <div className="kv" style={{ marginTop: 12, opacity: 0.8 }}>
            Last {list.length} readings:
          </div>
          <div
            className="row"
            style={{ gap: 8, flexWrap: "wrap", marginTop: 6 }}
          >
            {list.map((v) => (
              <span
                key={v.id}
                className="btn btn-pill"
                style={{ boxShadow: "none" }}
              >
                {new Date(v.tsISO).toLocaleTimeString()} · {v.hr}/{v.spo2}%/
                {v.sys}/{v.dia}
              </span>
            ))}
          </div>
        </>
      ) : (
        <div className="muted" style={{ marginTop: 6 }}>
          No vitals yet.
        </div>
      )}
    </div>
  );
}
