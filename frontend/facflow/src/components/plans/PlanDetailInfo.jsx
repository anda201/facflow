import React from "react";
import StatusBadge from "../common/StatusBadge";
import { COLORS } from "../../constants/colors";
import { PLAN_STATUS_META } from "../../constants/statusMeta";
import { fmt, toKstDateInputValue, displayDate } from "../../utils/format";

export default function PlanDetailInfo({ plan, producedQty, remainingQty }) {
  const rows = [
    ["상태", <StatusBadge status={plan.status} meta={PLAN_STATUS_META} fallback="WAIT" key="s" />],
    ["생산 예정일", displayDate(toKstDateInputValue(plan.planDate))],
    ["목표 수량", `${fmt(plan.targetQty)} EA`],
    ...(plan.status === "HALT"
      ? [
          ["생산 수량", `${fmt(producedQty)} EA`],
          ["남은 수량", `${fmt(remainingQty)} EA`],
        ]
      : [["등록일", toKstDateInputValue(plan.createdAt)]]),
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
        padding: "18px 22px",
        borderBottom: `1px solid ${COLORS.hairline}`,
      }}
    >
      {rows.map(([label, value]) => (
        <div key={label}>
          <div className="text-info-label" style={{ marginBottom: 5 }}>
            {label}
          </div>
          <div className="text-info-value">{value}</div>
        </div>
      ))}
    </div>
  );
}
