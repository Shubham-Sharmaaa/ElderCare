import { apiVitals, apiMeds } from "./fakeApi";
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const std = (a) => {
  if (!a.length) return 0;
  const m = mean(a);
  return Math.sqrt(mean(a.map((x) => (x - m) ** 2)));
};
const slope = (xs, ys) => {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return 0;
  const x = xs.slice(-n),
    y = ys.slice(-n);
  const xm = mean(x),
    ym = mean(y);
  let num = 0,
    den = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - xm) * (y[i] - ym);
    den += (x[i] - xm) ** 2;
  }
  return den ? num / den : 0;
};
export function buildPatientSnapshot(patient) {
  const history = apiVitals(patient.id);
  const tail = history.slice(-12);
  const hrs = history.map((p) => p.hr);
  const spo = history.map((p) => p.spo2 ?? 97);
  const ts = history.map((p) => p.ts);
  const now = Date.now();
  const last24 = history.filter((p) => now - p.ts <= 24 * 3600 * 1000);
  const meds = apiMeds(patient.id) || [];
  const iso = (d) => new Date(d).toISOString().slice(0, 10);
  const last7 = [...Array(7)].map((_, i) => iso(now - i * 86400000)).reverse();
  const taken = last7.map((day) =>
    meds.reduce((c, m) => c + (m.takenOn?.includes(day) ? 1 : 0), 0)
  );
  const totalDaily = meds.length || 1;
  const adherenceDays = taken.filter((x) => x >= totalDaily).length;
  return {
    patient: {
      id: patient.id,
      age: patient.age || 68,
      condition: patient.condition || "hypertension",
    },
    features: {
      hr_avg: +mean(hrs).toFixed(2),
      hr_std: +std(hrs).toFixed(2),
      hr_slope: +slope(ts, hrs).toFixed(4),
      spo2_avg: +mean(spo).toFixed(2),
      spo2_min: spo.length ? Math.min(...spo) : null,
      desats24: last24.filter((p) => (p.spo2 ?? 97) < 92).length,
      tachy24: last24.filter((p) => p.hr > 105).length,
      meds7d_adherence: +(adherenceDays / 7).toFixed(2),
      alerts_last7: 0,
    },
    tail: tail.map((p) => ({ ts: p.ts, hr: p.hr, spo2: p.spo2 ?? 97 })),
  };
}
