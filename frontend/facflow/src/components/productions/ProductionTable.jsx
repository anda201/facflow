import React from "react";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "../common";
import { PRODUCTION_STATUS_META } from "../../constants/productionMeta";
import { COLORS } from "../../constants/colors";
import { fmt, timeLabel, defectRateOf } from "../../utils/format";

function ProductionTable({ productions, runningCount, flashId, onRowClick }) {
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
          {productions.length}건의 실적
          {runningCount > 0 && " · 생산중 행을 클릭하면 완료 처리할 수 있어요"}
        </div>
      </div>

      {productions.length === 0 ? (
        <div
          style={{
            padding: "48px 20px",
            textAlign: "center",
            color: COLORS.faint,
            fontSize: 13,
          }}
        >
          선택한 날짜에 생산 실적이 없습니다.
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["실적 ID", "제품명", "장비", "시작 / 종료", "양품", "불량", "불량률", "상태", ""].map(
                (h, i) => (
                  <th
                    key={h || "act"}
                    style={{
                      textAlign: i === 4 || i === 5 || i === 6 ? "right" : i === 7 ? "center" : "left",
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
                )
              )}
            </tr>
          </thead>
          <tbody>
            {productions.map((p) => {
              const rate = defectRateOf(p.goodQty, p.defectQty);
              return (
                <tr
                  key={p.productionId}
                  className={`perf-row${p.status === "RUN" ? " perf-row--clickable" : ""}`}
                  onClick={
                    p.status === "RUN"
                      ? () => onRowClick(p.productionId)
                      : undefined
                  }
                  style={{
                    borderBottom: `1px solid ${COLORS.hairline}`,
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
