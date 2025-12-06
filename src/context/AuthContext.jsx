import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiAuth, apiHospital } from "../lib/fakeApi";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const raw = localStorage.getItem("wn_session");
    if (raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);

  // const login = async ({ email, password }) => {
  //   const u = apiAuth.loginByEmail(email, password);
  //   setUser(u);
  //   localStorage.setItem("wn_session", JSON.stringify(u));

  //   const to =
  //     u.role === "nri"
  //       ? "/dashboard"
  //       : u.role === "hospital"
  //       ? "/hospital"
  //       : u.role === "doctor"
  //       ? "/doctor"
  //       : u.role === "admin"
  //       ? "/admin"
  //       : "/";

  //   nav(to, { replace: true });
  //   return u;
  // };

  const login = async ({ email, password }) => {
    const u = await apiAuth.loginByEmail(email, password);

    // ---- doctor enrichment step ----
    if (u && u.role === "doctor") {
      // after finding doc
      const hosp = apiHospital.list().find((h) => h.id === u.hospitalId);
      const enriched = {
        id: u.id,
        role: "doctor",
        name: u.name,
        email: u.email,
        hospitalId: u.hospitalId,
        hospitalName: hosp?.name || "",
      };
      setUser(enriched);
      localStorage.setItem("wn_session", JSON.stringify(enriched));
      nav("/doctor", { replace: true });
      return enriched;
    }

    setUser(u);
    localStorage.setItem("wn_session", JSON.stringify(u));

    const to =
      u.role === "nri"
        ? "/dashboard"
        : u.role === "hospital"
        ? "/hospital"
        : u.role === "admin"
        ? "/admin"
        : "/";

    nav(to, { replace: true });
    return u;
  };

  const register = async ({ name, email, password }) => {
    const u = await apiAuth.registerNri({ name, email, password });
    setUser(u);
    localStorage.setItem("wn_session", JSON.stringify(u));
    nav("/dashboard", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("wn_session");
    setUser(null);
    nav("/", { replace: true, state: { from: loc.pathname } });
  };

  const value = useMemo(
    () => ({ user, loading, login, logout, register }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
