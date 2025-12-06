// // 0;
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { apiElders } from "../lib/fakeApi";
// import { useAuth } from "./AuthContext";

// const PatientContext = createContext(null);
// export const usePatients = () => {
//   const ctx = useContext(PatientContext);
//   if (!ctx) throw new Error("usePatients must be used inside PatientProvider");
//   return ctx;
// };

// export function PatientProvider({ children }) {
//   const { user } = useAuth();
//   const [elders, setElders] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Load elders for NRI owner
//   useEffect(() => {
//     if (!user?.id || user.role !== "nri") {
//       setElders([]);
//       return;
//     }
//     let alive = true;
//     setLoading(true);
//     Promise.resolve(apiElders.listByOwner(user.id))
//       .then((rows) => {
//         if (alive) setElders(rows);
//       })
//       .finally(() => alive && setLoading(false));
//     return () => {
//       alive = false;
//     };
//   }, [user?.id, user?.role]);

//   const refresh = async () => {
//     if (!user?.id) return;
//     const rows = await Promise.resolve(apiElders.listByOwner(user.id));
//     setElders(rows);
//   };

//   const value = useMemo(
//     () => ({ elders, setElders, refresh, loading }),
//     [elders, loading]
//   );

//   return (
//     <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
//   );
// }

// src/contexts/PatientContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiElders } from "../lib/fakeApi";
import { useAuth } from "./AuthContext";

const PatientContext = createContext(null);
export const usePatients = () => {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error("usePatients must be used inside PatientProvider");
  return ctx;
};

// small helper to call backend via Vite proxy (/api -> :5174)
async function fetchJSON(path, init) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${txt || res.statusText}`);
  }
  return res.json();
}

// server-first loader with fallback to fakeApi
async function loadEldersForOwner(ownerId) {
  if (!ownerId) return [];

  try {
    const qs = `?ownerId=${encodeURIComponent(ownerId)}`;
    const rows = await fetchJSON(`/api/elders${qs}`);

    // if backend returns all, filter client-side just in case
    const filtered = rows.filter((e) => e.ownerId === ownerId);
    return filtered;
  } catch (err) {
    console.warn(
      "[PatientContext] backend fetch failed, falling back to fakeApi:",
      err?.message || err
    );
    // fallback: use existing local-storage implementation
    return Promise.resolve(apiElders.listByOwner(ownerId));
  }
}

export function PatientProvider({ children }) {
  const { user } = useAuth();
  const [elders, setElders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load elders for NRI owner
  useEffect(() => {
    if (!user?.id || user.role !== "nri") {
      setElders([]);
      return;
    }
    let alive = true;
    setLoading(true);

    (async () => {
      const rows = await loadEldersForOwner(user.id);
      if (alive) setElders(rows);
    })()
      .catch((e) => console.error("[PatientContext] load error:", e))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [user?.id, user?.role]);

  const refresh = async () => {
    if (!user?.id) return;
    const rows = await loadEldersForOwner(user.id);
    setElders(rows);
  };

  const value = useMemo(
    () => ({ elders, setElders, refresh, loading }),
    [elders, loading]
  );

  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
}
