// src/components/plans/SummaryChip.jsx
// 계획 요약 칩 컴포넌트

import React from "react";
import { COLORS } from "../../constants/colors";

function SummaryChip({ label, value, color, Icon }) {
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
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 22,
            fontWeight: 600,
            lineHeight: 1,
            color: COLORS.text,
          }}
        >
          {value}
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
