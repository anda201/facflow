import React from "react";
import { COLORS } from "../../constants/colors";

function SummaryChip({ label, value, unit, color, Icon, active, onClick }) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      style={{
        flex: 1,
        background: active ? `${color}14` : COLORS.panel,
        border: `1px solid ${active ? color : COLORS.hairline}`,
        borderRadius: 4,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        ...(onClick && {
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "inherit",
          minWidth: 0,
        }),
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
      <div style={{ minWidth: onClick ? 0 : undefined }}>
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
            ...(onClick && {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }),
          }}
        >
          {label}
        </div>
      </div>
    </Wrapper>
  );
}

export default SummaryChip;
