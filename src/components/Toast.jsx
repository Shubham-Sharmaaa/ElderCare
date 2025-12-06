import React, { createContext, useContext, useState } from "react";
const ToastCtx = createContext(() => {});
export default function ToastProvider({ children }) {
  const [msg, setMsg] = useState("");
  const show = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2200);
  };
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {msg && (
        <div
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            background: "#111",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 8,
            opacity: 0.95,
          }}
        >
          {msg}
        </div>
      )}
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);
