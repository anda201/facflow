// src/components/dashboard/WeeklyTooltip.jsx
// 주간 생산량 차트 툴팁 컴포넌트

import React from "react";
import { fmt, dateLabel } from "../../utils/format";
import { COLORS } from "../../constants/colors";

function WeeklyTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  return (
    <div
      className="text-body-sm"
      style={{
        background: COLORS.panelAlt,
        border: `1px solid ${COLORS.hairline}`,
        borderRadius: 4,
        padding: "8px 12px",
        fontFamily: "var(--font-family-mono)",
      }}
    >
      <div className="text-body-muted" style={{ marginBottom: 4 }}>
        {dateLabel(item.date)} ({label})
      </div>
      <div>{fmt(item.productionQty)} EA</div>
    </div>
  );
}

export default WeeklyTooltip;
