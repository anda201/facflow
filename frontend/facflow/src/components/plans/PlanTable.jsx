// src/components/plans/PlanTable.jsx
// 생산 계획 목록 테이블 컴포넌트

import React from "react";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "../common";
import DelayBadge from "../common/DelayBadge";
import { PLAN_STATUS_META } from "../../constants/statusMeta";
import { COLORS } from "../../constants/colors";
import { fmt, toKstDateInputValue, displayDate } from "../../utils/format";
import { daysSince, delayVariantStyle, isDelayVariant } from "../../utils/delay";

function PlanTable({
  plans,
  dateTargetTotal,
  flashId,
  onRowClick,
  showPlanDate = false,
  showDueDate = false,
  showRemainingQty = false,
  countLabel,
  emptyMessage,
  borderRadius = "0 0 4px 4px",
  borderTop = "none",
  variant = "default",
}) {
  const delayStyle = delayVariantStyle(variant);
  const isDelay = isDelayVariant(variant);
  const isCritical = variant === "delay-critical";

  const headers = [];
  headers.push("계획 ID");
  if (showPlanDate) headers.push("생산 예정일");
  if (showDueDate) headers.push("마감일");
  headers.push("제품코드", "제품명", "목표 수량");
  if (showRemainingQty) headers.push("잔량");
  headers.push("상태", "등록일", "");

  const qtyColIndex = headers.indexOf("목표 수량");
  const remainingColIndex = headers.indexOf("잔량");
  const rightAlignCols = new Set([qtyColIndex, remainingColIndex].filter((i) => i >= 0));

  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${isDelay ? `${delayStyle.accent}33` : COLORS.hairline}`,
        borderTop,
        borderRadius,
        overflow: "hidden",
      }}
    >
      {!isDelay && (
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
            {countLabel ?? `${plans.length}건의 계획 · 행을 클릭하면 상세 정보를 볼 수 있어요`}
          </div>
          {dateTargetTotal != null && (
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11.5,
                color: COLORS.muted,
              }}
            >
              목표 수량 합계 {fmt(dateTargetTotal)} EA
            </div>
          )}
        </div>
      )}

      {plans.length === 0 ? (
        <div
          style={{
            padding: "48px 20px",
            textAlign: "center",
            color: COLORS.faint,
            fontSize: 13,
          }}
        >
          {emptyMessage ?? (
            <>
              선택한 날짜에 등록된 생산 계획이 없습니다.
              <br />
              상단의 &lsquo;새 계획 등록&rsquo;으로 계획을 추가하세요.
            </>
          )}
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={h || "chev"}
                  style={{
                    textAlign: rightAlignCols.has(i) ? "right" : "left",
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
              ))}
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => {
              const startDelayDays = showPlanDate ? daysSince(p.planDate) : 0;
              const dueDelayDays = showDueDate && p.dueDate ? daysSince(p.dueDate) : 0;
              const rowClass = isDelay
                ? `plan-row plan-row-${delayStyle.rowHoverClass}`
                : "plan-row";

              return (
                <tr
                  key={p.planId}
                  className={rowClass}
                  onClick={() => onRowClick(p.planId)}
                  style={{
                    borderBottom: `1px solid ${isDelay ? `${delayStyle.accent}1F` : COLORS.hairline}`,
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
                  {showPlanDate && (
                    <td
                      style={{
                        padding: "12px 18px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11.5,
                        color: COLORS.muted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {displayDate(toKstDateInputValue(p.planDate))}
                      {!isCritical && startDelayDays > 0 && (
                        <DelayBadge
                          label={`착수 ${startDelayDays}일 경과`}
                          color={delayStyle.accent}
                        />
                      )}
                    </td>
                  )}
                  {showDueDate && (
                    <td
                      style={{
                        padding: "12px 18px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11.5,
                        color: COLORS.muted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {displayDate(toKstDateInputValue(p.dueDate))}
                      {dueDelayDays > 0 && (
                        <DelayBadge
                          label={`마감 ${dueDelayDays}일 경과`}
                          color={delayStyle.accent}
                        />
                      )}
                    </td>
                  )}
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
                  {showRemainingQty && (
                    <td
                      style={{
                        padding: "12px 18px",
                        textAlign: "right",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12.5,
                        color: p.status === "HALT" ? COLORS.red : COLORS.faint,
                      }}
                    >
                      {p.remainingQty != null ? fmt(p.remainingQty) : "—"}
                    </td>
                  )}
                  <td style={{ padding: "12px 18px" }}>
                    <StatusBadge status={p.status} meta={PLAN_STATUS_META} fallback="WAIT" />
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
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PlanTable;
