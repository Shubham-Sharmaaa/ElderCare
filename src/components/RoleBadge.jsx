import React from "react";
const styles = {
  base: {
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    display: "inline-block",
  },
  admin: { background: "#fee2e2", color: "#991b1b" },
  hospital: { background: "#dbeafe", color: "#1e3a8a" },
  nri: { background: "#dcfce7", color: "#166534" },
};
export default function RoleBadge({ role }) {
  return (
    <span style={{ ...styles.base, ...(styles[role] || {}) }}>
      {role?.toUpperCase()}
    </span>
  );
}
