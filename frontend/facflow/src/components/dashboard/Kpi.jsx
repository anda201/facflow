// src/components/dashboard/Kpi.jsx
// KPI 카드 컴포넌트

import React from "react";

const COLORS = {
  panel: "#1B1F26",
  hairline: "#2B313B",
  red: "#E5484D",
  green: "#3DDC84",
  text: "#EDEFF2",
  muted: "#8A93A3",
  faint: "#565E6B",
};

// eyebrow: 위쪽 작은 제목 | value: 큰 숫자 | unit: 단위(%, ms, 건 등) | tone: 숫자의 색상 | sub: 아래 설명
function Kpi({ eyebrow, value, unit, tone = "neutral", sub }) {
  const toneColor =
    tone === "bad" ? COLORS.red : tone === "good" ? COLORS.green : COLORS.text;
  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.hairline}`,
        borderRadius: 4,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minHeight: 112,
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.08em",
          color: COLORS.muted,
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 40,
            fontWeight: 600,
            color: toneColor,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: 16,
              color: COLORS.muted,
            }}
          >
            {unit}
          </span>
        )}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: COLORS.faint }}>{sub}</div>
      )}
    </div>
  );
}

export default Kpi;
