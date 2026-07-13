// src/components/plans/StatusBadge.jsx
// 생산 계획 상태 배지 컴포넌트

import React from "react";
import { STATUS_META } from "../../constants/planMeta";

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.WAIT;
  const Icon = meta.icon;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: meta.color,
        border: `1px solid ${meta.color}55`,
        background: `${meta.color}14`,
        borderRadius: 3,
        padding: "3px 8px",
      }}
    >
      <Icon size={12} />
      {meta.label}
    </span>
  );
}

export default StatusBadge;
