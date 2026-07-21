import React from "react";

function StatusBadge({ status, meta, fallback }) {
  const resolved = meta[status] || meta[fallback];
  if (!resolved) return null;

  const Icon = resolved.icon;

  return (
    <span
      className="text-badge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        color: resolved.color,
        border: `1px solid ${resolved.color}55`,
        background: `${resolved.color}14`,
        borderRadius: 3,
        padding: "3px 8px",
      }}
    >
      {Icon ? <Icon size={12} /> : null}
      {resolved.label}
    </span>
  );
}

export default StatusBadge;
