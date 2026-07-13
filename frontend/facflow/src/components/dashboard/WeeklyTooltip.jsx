// src/components/dashboard/WeeklyTooltip.jsx
// 주간 생산량 차트 툴팁 컴포넌트

import React from "react";
import { fmt, dateLabel } from "../../utils/format";

const COLORS = {
  panelAlt: "#20242C", // 바탕 색상
  hairline: "#2B313B", // 테두리 색상
  text: "#EDEFF2", // 생산량 색상
  muted: "#8A93A3", // 날짜 색상
};

function WeeklyTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  return (
    <div
      style={{
        background: COLORS.panelAlt,
        border: `1px solid ${COLORS.hairline}`,
        borderRadius: 4,
        padding: "8px 12px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        color: COLORS.text,
      }}
    >
      <div style={{ color: COLORS.muted, marginBottom: 4 }}>
        {dateLabel(item.date)} ({label})
      </div>
      <div>{fmt(item.productionQty)} EA</div>
    </div>
  );
}

export default WeeklyTooltip;
