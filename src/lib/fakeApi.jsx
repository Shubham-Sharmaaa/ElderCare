const LS_KEY = "wn_db_v2";
let mem = null;

const nowISO = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10);

// ---- simple event bus for live vitals ----
const VITAL_EVENT = "wn:vitals";

// ---- HTTP helper to talk to backend via Vite proxy (/api -> :5174) ----
// async function fetchJSON(path, init) {
//   const res = await fetch(path, {
//     headers: { "Content-Type": "application/json" },
//     ...init,
//   });
//   if (!res.ok) throw new Error(`API ${res.status}`);
//   return res.json();
// }
const API_BASE = import.meta.env.VITE_API_BASE || "";

async function fetchJSON(path, init = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API ${res.status}`);
  }

  return res.json();
}

// Subscribe to live vitals for a specific elderId
export function onVitals(elderId, cb) {
  const handler = (e) => {
    const { elderId: id, row } = e.detail || {};
    if (id === elderId) cb(row);
  };
  window.addEventListener(VITAL_EVENT, handler);
  return () => window.removeEventListener(VITAL_EVENT, handler);
}

// (optional) BroadcastChannel for multi-tab live updates
let bc = null;
try {
  bc = new BroadcastChannel("wn_vitals");
} catch {}

export function onVitalsBC(elderId, cb) {
  if (!bc) return () => {};
  const handler = (msg) => {
    const { elderId: id, row } = msg.data || {};
    if (id === elderId) cb(row);
  };
  bc.addEventListener("message", handler);
  return () => bc.removeEventListener("message", handler);
}

function seed() {
  // hospitals
  const fortis = {
    id: uid(),
    name: "Fortis Patiala",
    email: "fortispatiala@hospital.com",
  };
  const aiims = {
    id: uid(),
    name: "AIIMS Delhi",
    email: "aiimsdelhi@hospital.com",
  };

  // doctors
  const docs = [
    {
      id: uid(),
      name: "Dr. Patel",
      hospitalId: fortis.id,
      email: "patel@fortis.example",
    },
    {
      id: uid(),
      name: "Dr. Kumar",
      hospitalId: fortis.id,
      email: "kumar@fortis.example",
    },
    {
      id: uid(),
      name: "Dr. Shah",
      hospitalId: aiims.id,
      email: "shah@aiims.example",
    },
  ];

  // users (auth)
  const users = [
    {
      id: uid(),
      role: "admin",
      name: "Site Admin",
      email: "admin@wellnest.io",
      password: "admin123",
    },
    {
      id: uid(),
      role: "nri",
      name: "Demo NRI",
      email: "nri@demo.io",
      password: "pass",
    },
    // Hospital and Doctor logins use their email field below (not in users array)
  ];

  // elders owned by NRI
  const elders = [
    {
      id: uid(),
      ownerId: users[1].id,
      name: "Sharma Ji",
      age: 68,
      condition: "Hypertension",
      notes: "Salt restricted",
      hospitalId: fortis.id,
      doctorId: null,
    },
  ];

  // meds, appointments, vitals, alerts
  const meds = [];
  const appointments = [
    {
      id: uid(),
      elderId: elders[0].id,
      doctor: "Dr. Patel",
      date: "2025-08-10",
      notes: "Follow-up",
    },
  ];
  const vitals = [
    {
      id: uid(),
      elderId: elders[0].id,
      tsISO: nowISO(),
      hr: 74,
      spo2: 98,
      sys: 122,
      dia: 78,
    },
  ];
  const alerts = [];

  return {
    users,
    hospitals: [fortis, aiims],
    doctors: docs,
    elders,
    meds,
    appointments,
    vitals,
    alerts,
    sessions: [],
  };
}

function db() {
  if (mem) return mem;
  const raw = localStorage.getItem(LS_KEY);
  mem = raw ? JSON.parse(raw) : seed();
  // ensure localStorage always has the structure
  localStorage.setItem(LS_KEY, JSON.stringify(mem));
  return mem;
}

function flush() {
  localStorage.setItem(LS_KEY, JSON.stringify(mem));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("wn:db"));
  }
}

// --- after db()/flush() definitions, add this one-time migration ---
(function migrateElderConditions() {
  const d = db();
  let changed = false;
  d.elders.forEach((e) => {
    if (!Array.isArray(e.conditions)) {
      if (typeof e.condition === "string" && e.condition.trim()) {
        e.conditions = [e.condition.trim()];
      } else {
        e.conditions = [];
      }
      // keep legacy field for older screens that still read condition
      e.condition = e.conditions[0] || "";
      changed = true;
    }
  });
  if (changed) flush();
})();

(function migrateHospitalEmails() {
  const d = db();
  let changed = false;
  d.hospitals.forEach((h) => {
    if (!h.email) {
      const token = h.name.split(" ")[0].toLowerCase();
      h.email = `${token}@hospital.demo`;
      changed = true;
    }
  });
  if (changed) flush();
})();

// --------- AUTH ----------
export const apiAuth = {
  /**
   * Universal login: finds the account by email across Users, Doctors, Hospitals.
   * Rules:
   * - NRI/Admin -> password REQUIRED and must match
   * - Doctor/Hospital -> password OPTIONAL (ignored for demo)
   * Returns a user object with correct role and required ids.
   */
  // loginByEmail(email, password = "") {
  //   const d = db();
  //   const e = (email || "").trim().toLowerCase();
  //   if (!e) throw new Error("Email is required");

  //   // 1) NRI/Admin users
  //   const u = d.users.find((x) => x.email.toLowerCase() === e);
  //   if (u) {
  //     if (!password) throw new Error("Password required");
  //     if (u.password !== password) throw new Error("Invalid credentials");
  //     return { id: u.id, role: u.role, name: u.name, email: u.email };
  //   }

  //   // 2) Doctors
  //   const doc = d.doctors.find((x) => x.email.toLowerCase() === e);
  //   if (doc) {
  //     // ✅ attach hospitalName
  //     const hospName =
  //       d.hospitals.find((h) => h.id === doc.hospitalId)?.name || "";
  //     return {
  //       id: doc.id,
  //       role: "doctor",
  //       name: doc.name,
  //       email: doc.email,
  //       hospitalId: doc.hospitalId,
  //       hospitalName: hospName,
  //       // added doctorId: doc.id,
  //     };
  //   }

  //   // 3) Hospitals
  //   const hosp = d.hospitals.find((x) => (x.email || "").toLowerCase() === e);
  //   console.log(hosp);
  //   if (hosp) {
  //     return {
  //       id: hosp.id,
  //       role: "hospital",
  //       name: hosp.name,
  //       email: hosp.email,
  //       hospitalId: hosp.id,
  //     };
  //   }

  //   throw new Error("Account not found for this email");
  // },

  async loginByEmail(email, password = "") {
    const e = (email || "").trim().toLowerCase();
    if (!e) throw new Error("Email is required");

    // 1) Try backend login first
    try {
      const u = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e, password }),
      }).then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`API ${res.status}: ${txt || res.statusText}`);
        }
        return res.json();
      });

      // u already has role + ids shaped for AuthContext
      return u;
    } catch (err) {
      console.warn(
        "[apiAuth.loginByEmail] backend login failed, falling back:",
        err?.message || err
      );
    }

    // 2) Fallback: original local fakeApi behaviour
    const d = db();

    // NRI/Admin users (local)
    const u = d.users.find((x) => x.email.toLowerCase() === e);
    if (u) {
      if (!password) throw new Error("Password required");
      if (u.password !== password) throw new Error("Invalid credentials");
      return { id: u.id, role: u.role, name: u.name, email: u.email };
    }

    // Doctors (local)
    const doc = d.doctors.find((x) => x.email.toLowerCase() === e);
    if (doc) {
      const hospName =
        d.hospitals.find((h) => h.id === doc.hospitalId)?.name || "";
      return {
        id: doc.id,
        role: "doctor",
        name: doc.name,
        email: doc.email,
        hospitalId: doc.hospitalId,
        hospitalName: hospName,
        doctorId: doc.id,
      };
    }

    // Hospitals (local)
    const hosp = d.hospitals.find((x) => (x.email || "").toLowerCase() === e);
    if (hosp) {
      return {
        id: hosp.id,
        role: "hospital",
        name: hosp.name,
        email: hosp.email,
        hospitalId: hosp.id,
      };
    }

    throw new Error("Account not found for this email");
  },

  async registerNri({ name, email, password }) {
    const d = db();
    if (d.users.some((u) => u.email === email)) throw new Error("Email exists");

    const u = { id: uid(), role: "nri", name, email, password };
    d.users.push(u);
    flush();

    // 🔄 background sync to backend
    await fetchJSON("/api/auth/register-nri", {
      method: "POST",
      body: JSON.stringify({
        _id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
      }),
    }).catch((err) =>
      console.warn("[apiAuth.registerNri] backend sync failed:", err?.message)
    );

    return { id: u.id, role: u.role, name: u.name, email: u.email };
  },
};

// --------- HOSPITAL / DOCTORS ----------
export const apiHospital = {
  async list() {
    const res = await fetch("/api/hospitals");
    console.log("hh  ", res);
    if (!res.ok) throw new Error("API error");
    const hospitals = await res.json();
    return hospitals;
  },
  // in apiHospital.add(name)
  async add(name, email) {
    console.log(email);
    const emailToken = email
      ? email.split("@")[0]
      : name.split(" ")[0].toLowerCase();
    const h = { id: uid(), name, email: `${emailToken}@hospital.demo` };
    console.log("h: ", h);
    db().hospitals.push(h);
    flush();
    // 🔄 background sync to backend
    await fetchJSON("/api/hospitals", {
      method: "POST",
      body: JSON.stringify({
        _id: h.id,
        name: h.name,
        email: h.email,
      }),
    }).catch((err) =>
      console.warn("[apiHospital.add] backend sync failed:", err?.message)
    );
    return h;
  },

  async doctors(hospitalId) {
    const res = await fetchJSON(
      `/api/hospitals/${encodeURIComponent(hospitalId)}/doctors`
    );

    if (res && Array.isArray(res)) return res;
    return db().doctors.filter((d) => d.hospitalId === hospitalId);
  },
  async addDoctor(hospitalId, name, email) {
    const dct = { id: uid(), hospitalId, name, email };
    db().doctors.push(dct);
    flush();

    // 🔄 background sync to backend
    await fetchJSON(
      `/api/hospitals/${encodeURIComponent(hospitalId)}/doctors`,
      {
        method: "POST",
        body: JSON.stringify({
          _id: dct.id,
          name: dct.name,
          email: dct.email,
        }),
      }
    ).catch((err) =>
      console.warn("[apiHospital.addDoctor] backend sync failed:", err?.message)
    );

    return dct;
  },

  async elders(hospitalId) {
    const res = await fetchJSON(
      `/api/elders/?hospitalId=${encodeURIComponent(hospitalId)}`
    );
    return res;
  },
  async assignDoctor(elderId, doctorId) {
    const d = db();

    const e = await fetchJSON(
      `/api/elders/?elderId=${encodeURIComponent(elderId)}`
    );
    console.log(`/api/doctors/?doctorId=${encodeURIComponent(doctorId)}`);
    const doc = await fetchJSON(
      `/api/doctors/?doctorId=${encodeURIComponent(doctorId)}`
    );
    console.log("Fetched elder for assignDoctor:", e);
    console.log("Fetched doctor for assignDoctor:", doc);
    if (!e || !doc) throw new Error("Not found");
    if (doc.hospitalId !== e.hospitalId)
      throw new Error("Doctor must be from same hospital");

    // 1) Local update (UI stays instant)
    e.doctorId = doctorId;
    flush();

    // 2) Background sync to Mongo using PUT /api/elders/:id
    const res = await fetchJSON(`/api/elders/${encodeURIComponent(elderId)}`, {
      method: "PUT",
      body: JSON.stringify({
        // send full elder state so backend has everything consistent
        name: e.name,
        age: e.age,
        conditions: e.conditions || [],
        notes: e.notes,
        hospitalId: e.hospitalId,
        doctorId: e.doctorId, // 👈 updated doctor
      }),
    })
      .then((docUpdated) => {
        console.log(
          "[apiHospital.assignDoctor] synced to backend:",
          docUpdated
        );
      })
      .catch((err) =>
        console.warn(
          "[apiHospital.assignDoctor] backend sync failed:",
          err?.message || err
        )
      );

    return e;
  },
};

// --------- ELDERS (NRI) ----------
// --------- ELDERS (NRI) ----------

export const apiElders = {
  async create({
    ownerId,
    name,
    age,
    condition,
    conditions,
    notes,
    hospitalId,
  }) {
    if (!ownerId || !hospitalId)
      throw new Error("ownerId & hospitalId required");
    if (!name | !age | !condition) {
      throw new Error("name, age and condition are required");
    }
    const list = Array.isArray(conditions)
      ? conditions
      : typeof condition === "string" && condition.trim()
      ? [condition.trim()]
      : [];

    const e = {
      id: uid(),
      ownerId,
      name,
      age: Number(age) || 0,
      conditions: list,
      // keep legacy mirror for any old UI still showing `condition`
      condition: list[0] || "",
      notes,
      hospitalId,
      doctorId: null,
    };

    // ✅ update in-memory + localStorage (old behavior)
    db().elders.push(e);
    flush();

    // 🔄 fire-and-forget sync to backend (does NOT change return value)
    await fetchJSON("/api/elders", {
      method: "POST",
      body: JSON.stringify({
        _id: e.id,
        ownerId: e.ownerId,
        name: e.name,
        age: e.age,
        conditions: e.conditions,
        notes: e.notes,
        hospitalId: e.hospitalId,
        doctorId: e.doctorId,
      }),
    }).catch((err) =>
      console.warn("[apiElders.create] backend sync failed:", err?.message)
    );

    return e;
  },

  update(id, patch) {
    const e = db().elders.find((x) => x.id === id);
    if (!e) throw new Error("Elder not found");

    // 1) apply patch locally (for UI)
    Object.assign(e, patch);

    // keep the old single-string `condition` mirror updated
    if (Array.isArray(patch.conditions)) {
      e.condition = e.conditions[0] || "";
    }

    flush();

    // 2) background sync to backend (Mongo)
    fetchJSON(`/api/elders/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify({
        name: e.name,
        age: e.age,
        conditions: e.conditions,
        notes: e.notes,
        hospitalId: e.hospitalId,
        doctorId: e.doctorId,
      }),
    })
      .then((doc) => {
        console.log("[apiElders.update] synced to backend:", doc);
      })
      .catch((err) => {
        console.warn(
          "[apiElders.update] backend sync failed:",
          err?.message || err
        );
      });

    return e;
  },

  setConditions(elderId, conditions) {
    const e = db().elders.find((x) => x.id === elderId);
    if (!e) throw new Error("Elder not found");

    // 1) Local update
    e.conditions = (conditions || [])
      .map((c) => String(c).trim())
      .filter(Boolean);
    e.condition = e.conditions[0] || ""; // legacy mirror
    flush();

    // 2) Background sync to Mongo
    fetchJSON(`/api/elders/${encodeURIComponent(elderId)}`, {
      method: "PUT",
      body: JSON.stringify({
        name: e.name,
        age: e.age,
        conditions: e.conditions, // 👈 updated conditions array
        notes: e.notes,
        hospitalId: e.hospitalId,
        doctorId: e.doctorId,
      }),
    })
      .then((docUpdated) => {
        console.log("[apiElders.setConditions] synced to backend:", docUpdated);
      })
      .catch((err) =>
        console.warn(
          "[apiElders.setConditions] backend sync failed:",
          err?.message || err
        )
      );

    return e;
  },

  // ⚠️ stays synchronous – returns array, not Promise
  async listByOwner(ownerId) {
    const res = await fetch(
      `/api/elders/?ownerId=${encodeURIComponent(ownerId)}`
    );

    if (!res.ok) return db().elders.filter((e) => e.ownerId === ownerId);
    else {
      let data = await res.json();
      return data;
    }
  },

  // used by hospital/doctor dashboards – also stays sync
  async listByHospital(hospitalId) {
    const res = await fetchJSON(
      `/api/elders/?hospitalId=${encodeURIComponent(hospitalId)}`
    );
    if (res && Array.isArray(res)) return res;
    return db().elders.filter((e) => e.hospitalId === hospitalId);
  },

  async listByDoctor(doctorId) {
    // console.log(db().elders.filter((e) => e.doctorId === doctorId));
    const doc = await fetchJSON(
      `/api/doctors/?doctorId=${encodeURIComponent(doctorId)}`
    );
    if (doc) return doc;
    return db().elders.filter((e) => e.doctorId === doctorId);
  },

  remove(id) {
    const d = db();
    d.elders = d.elders.filter((e) => e.id !== id);
    d.meds = d.meds.filter((m) => m.elderId !== id);
    flush();
    // (you can also call DELETE /api/elders/:id here later if needed)
  },
};

// --------- APPOINTMENTS ----------
export const apiAppointments = {
  list(elderId) {
    return db().appointments.filter((a) => a.elderId === elderId);
  },
  add(appt) {
    const a = { id: uid(), ...appt };
    db().appointments.push(a);
    flush();
    return a;
  },
  remove(id) {
    db().appointments = db().appointments.filter((a) => a.id !== id);
    flush();
  },
};

// --------- MEDICATIONS ----------
const todayKey = () => new Date().toISOString().slice(0, 10);

export const apiMeds = {
  listForElder(elderId) {
    return db().meds.filter((m) => m.elderId === elderId);
  },
  listTodayForOwner(ownerId) {
    const ids = apiElders.listByOwner(ownerId).map((e) => e.id);
    const t = todayKey();
    return db()
      .meds.filter((m) => ids.includes(m.elderId))
      .map((m) => ({ ...m, taken: !!m.takenOn?.[t] }));
  },
  add({ elderId, medicine, timeHHmm }) {
    const row = { id: uid(), elderId, medicine, timeHHmm, takenOn: {} };
    db().meds.push(row);
    flush();
    return row;
  },
  toggle(medId, dateKey = todayKey()) {
    const m = db().meds.find((x) => x.id === medId);
    if (!m.takenOn) m.takenOn = {};
    m.takenOn[dateKey] = !m.takenOn[dateKey];
    flush();
    return { ...m, taken: !!m.takenOn[dateKey] };
  },
};

export const apiVitals = {
  push(elderId, sample) {
    console.log("elderId in vitals push: ", elderId);
    const row = { id: uid(), elderId, tsISO: nowISO(), ...sample };
    // ✅ local behavior (unchanged)
    db().vitals.push(row);
    flush();

    // 🔄 background sync to backend
    fetchJSON(`/api/elders/${encodeURIComponent(elderId)}/vitals`, {
      method: "POST",
      body: JSON.stringify({
        hr: row.hr,
        spo2: row.spo2,
        sys: row.sys,
        dia: row.dia,
        tsISO: row.tsISO,
        source: "sim",
      }),
    }).catch((err) =>
      console.warn("[apiVitals.push] backend sync failed:", err?.message)
    );

    // 🔔 live events (same-tab)
    window.dispatchEvent(
      new CustomEvent("wn:vitals", { detail: { elderId, row } })
    );
    // 🔔 multi-tab (optional)
    try {
      bc?.postMessage({ elderId, row });
    } catch {}

    return row;
  },

  async recent(elderId, limit = 20) {
    // still reads from local DB (fast, sync)
    const res = await fetchJSON(
      `/api/elders/${encodeURIComponent(elderId)}/vitals`
    );
    console.log("res1:  ", res);
    if (!res || !res.ok) {
      return db()
        .vitals.filter((v) => v.elderId === elderId)
        .slice(-limit);
    } else {
      return res.then((data) => data.slice(-limit));
    }
  },
};

// --------- ALERTS ----------
export const apiAlerts = {
  all() {
    return db().alerts;
  },
  add(text) {
    db().alerts.push({ id: uid(), tsISO: nowISO(), text });
    flush();
  },
};

// --------- AI helper payload ----------
export const apiAi = {
  async profile(elderId) {
    const d = db();
    const e = await fetchJSON(
      `/api/elders?elderId=${encodeURIComponent(elderId)}`
    );

    if (!e) return null;
    const hospital = await fetchJSON(
      `/api/hospitals/?hospitalId=${encodeURIComponent(e.hospitalId)}`
    );

    const hosp = hospital?.name;
    const doctor = await fetchJSON(
      `/api/doctors?doctorId=${encodeURIComponent(e.doctorId)}`
    );

    const doc = doctor?.name || "(unassigned)";

    const meds = d.meds
      .filter((m) => m.elderId === elderId)
      .map((m) => `${m.medicine} @ ${m.timeHHmm}`);
    const lastVitals = d.vitals.filter((v) => v.elderId === elderId).slice(-5);
    // Normalize: support either elder.conditions[] or elder.condition

    const conditions =
      Array.isArray(e.conditions) && e.conditions.length
        ? e.conditions
        : e.condition
        ? [e.condition]
        : [];

    return {
      ...e,
      conditions, // <— new
      condition: e.condition || "", // keep legacy
      hospital: hosp,
      doctor: doc,
      meds,
      lastVitals,
    };
  },
};

// ---- Demo seed (runs once per reload during dev)
(function seedOnce() {
  if (typeof window === "undefined") return;
  const k = "__wn_seed_v2__";
  if (sessionStorage.getItem(k)) return;
  sessionStorage.setItem(k, "1");

  const d = db();
  // Find demo NRI user
  const demoNri = d.users.find?.((u) => u.role === "nri") || null;
  const fortis = d.hospitals[0] || null;
  if (!demoNri || !fortis) return;

  // Create an elder if none
  if (!d.elders.length) {
    d.elders.push({
      id: String(Math.random()),
      ownerId: demoNri.id,
      name: "Sharma Ji",
      age: 69,
      condition: "Hypertension",
      notes: "Salt restricted",
      hospitalId: fortis.id,
      doctorId: null,
    });
    flush();
  }

  // A few vitals
  const eid = d.elders[0].id;
  if (d.vitals.length < 3) {
    apiVitals.push(eid, { hr: 78, spo2: 96, sys: 124, dia: 79 });
    apiVitals.push(eid, { hr: 82, spo2: 95, sys: 132, dia: 82 });
    apiVitals.push(eid, { hr: 88, spo2: 92, sys: 142, dia: 90 });
  }
})();

// ======= ADD after existing data and exports =======

// Extra stores
const reports = []; // { id, elderId, title, url, status: 'pending'|'approved', tsISO }
const notes = []; // { id, elderId, doctorId, tsISO, text }

// ---------- ADMIN ----------
export const apiAdmin = {
  async listNri() {
    const res = await fetchJSON("/api/user");
    return res;
  },
  async listUsers() {
    let users = await apiAdmin.listNri();
    users = users.map((user) => {
      return { ...user, role: "nri" };
    });
    let hosps = await apiHospital.list();
    hosps = hosps.map((hosp) => {
      return { ...hosp, role: "hosp" };
    });
    let docs = await apiAdmin.listDoctors();
    docs = docs.map((doc) => {
      return { ...doc, role: "doc" };
    });
    return [...users, ...hosps, ...docs];
  },

  async createHospital(name, email) {
    return await apiHospital.add(name, email);
  },

  async listHospitals() {
    return await apiHospital.list();
  },
  async listDoctors() {
    const res = await fetchJSON("/api/doctors/all");
    if (res) return res;
    return [];
  },
  addDoctor(hospitalId, name, email) {
    return apiHospital.addDoctor(hospitalId, name, email);
  },
};

// ---------- REPORTS ----------
export const apiReports = {
  // 💡 NOW ASYNC
  async listForElder(elderId) {
    try {
      const rows = await fetchJSON(
        `/api/elders/${encodeURIComponent(elderId)}/reports`
      );
      return rows;
    } catch (e) {
      console.warn(
        "[apiReports.listForElder] backend failed, using local:",
        e?.message || e
      );
      return reports
        .filter((r) => r.elderId === elderId)
        .sort((a, b) => a.tsISO.localeCompare(b.tsISO));
    }
  },

  async listForHospital(hospitalId) {
    try {
      const rows = await fetchJSON(
        `/api/hospitals/${encodeURIComponent(hospitalId)}/reports`
      );
      return rows;
    } catch (e) {
      console.warn(
        "[apiReports.listForHospital] backend failed, using local:",
        e?.message || e
      );
      const ids = db()
        .elders.filter((e) => e.hospitalId === hospitalId)
        .map((e) => e.id);
      return reports.filter((r) => ids.includes(r.elderId));
    }
  },

  async upload({ elderId, title, url }) {
    // local row (for immediate UI)
    const row = {
      id: uid(),
      elderId,
      title,
      url,
      status: "pending",
      tsISO: new Date().toISOString(),
    };
    reports.push(row);
    flush();

    // sync to backend
    try {
      const created = await fetchJSON(
        `/api/elders/${encodeURIComponent(elderId)}/reports`,
        {
          method: "POST",
          body: JSON.stringify({
            _id: row.id, // keep same id
            title: row.title,
            url: row.url,
            status: row.status,
            tsISO: row.tsISO,
          }),
        }
      );
      console.log("[apiReports.upload] synced:", created);
      return created;
    } catch (e) {
      console.warn("[apiReports.upload] backend sync failed:", e?.message || e);
      // still return local row so UI doesn't break
      return row;
    }
  },

  async setStatus(id, status) {
    // update local
    const r = reports.find((x) => x.id === id);
    if (r) {
      r.status = status;
      flush();
    }

    // sync to backend
    try {
      const updated = await fetchJSON(
        `/api/reports/${encodeURIComponent(id)}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ status }),
        }
      );
      console.log("[apiReports.setStatus] synced:", updated);
      return updated;
    } catch (e) {
      console.warn(
        "[apiReports.setStatus] backend sync failed:",
        e?.message || e
      );
      return r || null;
    }
  },
};

// ---------- DOCTOR NOTES ----------
export const apiNotes = {
  async list(elderId) {
    try {
      const rows = await fetchJSON(
        `/api/elders/${encodeURIComponent(elderId)}/notes`
      );
      return rows;
    } catch (e) {
      console.warn(
        "[apiNotes.list] backend failed, using local:",
        e?.message || e
      );
      return notes
        .filter((n) => n.elderId === elderId)
        .sort((a, b) => a.tsISO.localeCompare(b.tsISO));
    }
  },

  async add({ elderId, doctorId, text }) {
    const row = {
      id: uid(),
      elderId,
      doctorId,
      text,
      tsISO: new Date().toISOString(),
    };
    notes.push(row);
    flush();

    try {
      const created = await fetchJSON(
        `/api/elders/${encodeURIComponent(elderId)}/notes`,
        {
          method: "POST",
          body: JSON.stringify({
            _id: row.id,
            doctorId: row.doctorId,
            text: row.text,
            tsISO: row.tsISO,
          }),
        }
      );
      console.log("[apiNotes.add] synced:", created);
      return created;
    } catch (e) {
      console.warn("[apiNotes.add] backend sync failed:", e?.message || e);
      return row;
    }
  },
};

// ---------- RISK helper (for triage) ----------
export function computeRiskFromVitals(v) {
  // quick risk scoring
  let r = 0;
  if (!v) return 0;
  if (v.spo2 < 92) r += 3;
  else if (v.spo2 < 95) r += 1;
  if (v.sys >= 140 || v.dia >= 90) r += 2;
  if (v.hr >= 100) r += 1;
  return r; // 0–6
}

// Simple catalog helpers for login dropdowns
export const apiCatalog = {
  hospitals() {
    return db().hospitals.map((h) => ({ id: h.id, name: h.name }));
  },
  doctors() {
    return db().doctors.map((d) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      hospitalId: d.hospitalId,
    }));
  },
};
