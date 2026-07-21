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
          <span className="text-chip-value" style={{ lineHeight: 1 }}>
            {value}
          </span>
          {unit && <span className="text-chip-unit">{unit}</span>}
        </div>
        <div
          className="text-chip-label"
          style={{
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
