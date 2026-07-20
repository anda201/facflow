import React from "react";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "../common";
import DelayBadge from "../common/DelayBadge";
import { PRODUCTION_STATUS_META } from "../../constants/statusMeta";
import { COLORS } from "../../constants/colors";
import { fmt, timeLabel, defectRateOf, toKstDateInputValue, displayDate } from "../../utils/format";
import { daysSince, delayVariantStyle, isDelayVariant } from "../../utils/delay";

function ProductionTable({
  productions,
  runningCount,
  flashId,
  onRowClick,
  showPlanDate = false,
  showDueDate = false,
  countLabel,
  emptyMessage,
  borderRadius = "0 0 4px 4px",
  borderTop = "none",
  variant = "default",
}) {
  const delayStyle = delayVariantStyle(variant);
  const isDelay = isDelayVariant(variant);
  const isCritical = variant === "delay-critical";

  const headers = ["실적 ID"];
  if (showPlanDate) headers.push("생산 예정일");
  if (showDueDate) headers.push("마감일");
  headers.push("제품명", "장비", "시작 / 종료", "양품", "불량", "불량률", "상태", "");

  const numericStartIndex = headers.indexOf("양품");

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
            {countLabel ?? `${productions.length}건의 실적${runningCount > 0 ? " · 생산중 행을 클릭하면 완료 처리할 수 있어요" : ""}`}
          </div>
        </div>
      )}

      {productions.length === 0 ? (
        <div
          style={{
            padding: "48px 20px",
            textAlign: "center",
            color: COLORS.faint,
            fontSize: 13,
          }}
        >
          {emptyMessage ?? "선택한 날짜에 생산 실적이 없습니다."}
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={h || "act"}
                  style={{
                    textAlign:
                      i >= numericStartIndex && i <= numericStartIndex + 2
                        ? "right"
                        : i === headers.length - 2
                        ? "center"
                        : "left",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10.5,
                    color: COLORS.faint,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "10px 16px",
                    borderBottom: `1px solid ${COLORS.hairline}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productions.map((p) => {
              const rate = defectRateOf(p.goodQty, p.defectQty);
              const startDelayDays = showPlanDate ? daysSince(p.planDate) : 0;
              const dueDelayDays = showDueDate && p.dueDate ? daysSince(p.dueDate) : 0;
              const rowExtraClass = isDelay ? ` perf-row-${delayStyle.rowHoverClass}` : "";

              return (
                <tr
                  key={p.productionId}
                  className={`perf-row${p.status === "RUN" ? " perf-row--clickable" : ""}${rowExtraClass}`}
                  onClick={
                    p.status === "RUN"
                      ? () => onRowClick(p.productionId)
                      : undefined
                  }
                  style={{
                    borderBottom: `1px solid ${isDelay ? `${delayStyle.accent}1F` : COLORS.hairline}`,
                    animation: flashId === p.productionId ? "flashRow 2.2s ease-out" : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 16px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: COLORS.faint,
                    }}
                  >
                    #{p.productionId}
                  </td>
                  {showPlanDate && (
                    <td
                      style={{
                        padding: "12px 16px",
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
                        padding: "12px 16px",
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
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{p.productName}</td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: COLORS.muted,
                    }}
                  >
                    {p.equipmentName}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11.5,
                      color: COLORS.muted,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {timeLabel(p.startTime)} – {p.endTime ? timeLabel(p.endTime) : "진행중"}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12.5,
                      color: COLORS.green,
                    }}
                  >
                    {fmt(p.goodQty)}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12.5,
                      color: COLORS.red,
                    }}
                  >
                    {fmt(p.defectQty)}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: rate > 5 ? COLORS.red : COLORS.muted,
                    }}
                  >
                    {rate.toFixed(2)}%
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <StatusBadge
                      status={p.status}
                      meta={PRODUCTION_STATUS_META}
                      fallback="DONE"
                    />
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: COLORS.faint }}>
                    {p.status === "RUN" ? <ChevronRight size={15} /> : null}
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

export default ProductionTable;
