// src/components/plans/PlanTable.jsx
// 생산 계획 목록 테이블 컴포넌트

import React from "react";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "../common";
import { STATUS_META } from "../../constants/planMeta";
import { COLORS } from "../../constants/colors";
import { fmt, toKstDateInputValue } from "../../utils/format";

function PlanTable({ plans, dateTargetTotal, flashId, onRowClick }) {
  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.hairline}`,
        borderTop: "none",
        borderRadius: "0 0 4px 4px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 18px",
          borderBottom: `1px solid ${COLORS.hairline}`,
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11.5,
            color: COLORS.muted,
          }}
        >
          {plans.length}건의 계획 · 행을 클릭하면 상세 정보를 볼 수 있어요
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11.5,
            color: COLORS.muted,
          }}
        >
          목표 수량 합계 {fmt(dateTargetTotal)} EA
        </div>
      </div>

      {plans.length === 0 ? (
        <div
          style={{
            padding: "48px 20px",
            textAlign: "center",
            color: COLORS.faint,
            fontSize: 13,
          }}
        >
          선택한 날짜에 등록된 생산 계획이 없습니다.
          <br />
          상단의 &lsquo;새 계획 등록&rsquo;으로 계획을 추가하세요.
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["계획 ID", "제품코드", "제품명", "목표 수량", "상태", "등록일", ""].map(
                (h, i) => (
                  <th
                    key={h || "chev"}
                    style={{
                      textAlign: i === 3 ? "right" : "left",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10.5,
                      color: COLORS.faint,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      padding: "10px 18px",
                      borderBottom: `1px solid ${COLORS.hairline}`,
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => (
              <tr
                key={p.planId}
                className="plan-row"
                onClick={() => onRowClick(p.planId)}
                style={{
                  borderBottom: `1px solid ${COLORS.hairline}`,
                  animation: flashId === p.planId ? "flashRow 2.2s ease-out" : "none",
                }}
              >
                <td
                  style={{
                    padding: "12px 18px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: COLORS.faint,
                  }}
                >
                  #{p.planId}
                </td>
                <td
                  style={{
                    padding: "12px 18px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: COLORS.muted,
                  }}
                >
                  {p.productCode}
                </td>
                <td style={{ padding: "12px 18px", fontSize: 13 }}>{p.productName}</td>
                <td
                  style={{
                    padding: "12px 18px",
                    textAlign: "right",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12.5,
                  }}
                >
                  {fmt(p.targetQty)}
                </td>
                <td style={{ padding: "12px 18px" }}>
                  <StatusBadge status={p.status} meta={STATUS_META} fallback="WAIT" />
                </td>
                <td
                  style={{
                    padding: "12px 18px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11.5,
                    color: COLORS.faint,
                  }}
                >
                  {toKstDateInputValue(p.createdAt)}
                </td>
                <td
                  style={{
                    padding: "12px 14px",
                    textAlign: "right",
                    color: COLORS.faint,
                  }}
                >
                  <ChevronRight size={15} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PlanTable;
