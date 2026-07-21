import React from "react";

export default function DelayBadge({ label, color }) {
  if (!label) return null;
  return (
    <span
      className="text-delay-badge"
      style={{
        marginLeft: 8,
        fontWeight: 700,
        color,
        background: `${color}22`,
        padding: "2px 6px",
        borderRadius: 3,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
