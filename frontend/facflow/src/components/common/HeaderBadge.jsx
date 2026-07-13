import React from "react";

function HeaderBadge({ label, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color,
        border: `1px solid ${color}`,
        borderRadius: 4,
        padding: "6px 12px",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
        }}
      />
      {label}
    </div>
  );
}

export default HeaderBadge;
