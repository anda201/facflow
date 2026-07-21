// src/components/dashboard/Kpi.jsx
// KPI 카드 컴포넌트

import React from "react";
import { COLORS } from "../../constants/colors";

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
      <div className="text-kpi-label" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {eyebrow}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span className="text-kpi-value" style={{ color: toneColor, lineHeight: 1 }}>
          {value}
        </span>
        {unit && <span className="text-kpi-unit">{unit}</span>}
      </div>
      {sub && <div className="text-kpi-sub">{sub}</div>}
    </div>
  );
}

export default Kpi;
