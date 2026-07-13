import React from "react";
import { COLORS } from "../../constants/colors";

function SummaryChip({ label, value, unit, color, Icon }) {
  return (
    <div
      style={{
        flex: 1,
        background: COLORS.panel,
        border: `1px solid ${COLORS.hairline}`,
        borderRadius: 4,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 4,
          background: `${color}18`,
          border: `1px solid ${color}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={16} color={color} />
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1,
              color: COLORS.text,
            }}
          >
            {value}
          </span>
          {unit && (
            <span
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: 12,
                color: COLORS.muted,
              }}
            >
              {unit}
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            color: COLORS.muted,
            marginTop: 3,
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

export default SummaryChip;
