// src/components/dashboard/AchievementGaugeCard.jsx
// 목표 달성률 게이지 카드 컴포넌트

import React from "react";
import AchievementGauge from "./AchievementGauge";
import { fmtPct } from "../../utils/format";
import { COLORS } from "../../constants/colors";

function AchievementGaugeCard({ value }) {
  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.hairline}`,
        borderRadius: 4,
        padding: "16px 18px 8px",
        display: "flex",
        flexDirection: "column",
        gridRow: "span 1",
      }}
    >
      <div
        className="text-kpi-label"
        style={{ letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}
      >
        목표 달성률
      </div>
      <div style={{ flex: 1, minHeight: 120 }}>
        <AchievementGauge value={value} />
      </div>
      <div className="text-gauge-value" style={{ textAlign: "center", marginTop: -18, color: COLORS.red }}>
        {fmtPct(value, 1)}%
      </div>
    </div>
  );
}

export default AchievementGaugeCard;
