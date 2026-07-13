import React, { useState } from "react";
import { X, PlayCircle, Check, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "../common";
import { COLORS } from "../../constants/colors";
import { PRODUCTION_STATUS_META } from "../../constants/productionMeta";
import { fmt, timeLabel, durationLabel, defectRateOf } from "../../utils/format";

function ProductionDetailCard({ production, onClose, onComplete }) {
  const [confirmingComplete, setConfirmingComplete] = useState(false);
  const rate = defectRateOf(production.goodQty, production.defectQty);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(6,7,9,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(520px, 100%)",
          maxHeight: "88vh",
          overflowY: "auto",
          background: COLORS.panel,
          border: `1px solid ${COLORS.hairline}`,
          borderRadius: 6,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "20px 22px 16px",
            borderBottom: `1px solid ${COLORS.hairline}`,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: COLORS.faint,
                marginBottom: 6,
              }}
            >
              실적 #{production.productionId} · {production.equipmentName}
            </div>
            <div
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {production.productName}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: COLORS.muted,
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            padding: "18px 22px",
            borderBottom: `1px solid ${COLORS.hairline}`,
          }}
        >
          {[
            ["상태", <StatusBadge status={production.status} meta={PRODUCTION_STATUS_META} fallback="DONE" key="s" />],
            ["시작 시각", timeLabel(production.startTime)],
            ["경과 시간", durationLabel(production.startTime, production.endTime)],
            ["양품 / 불량", `${fmt(production.goodQty)} / ${fmt(production.defectQty)} EA`],
            ["불량률", `${rate.toFixed(2)}%`],
            ["종료 시각", production.endTime ? timeLabel(production.endTime) : "진행중"],
          ].map(([label, value]) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10.5,
                  color: COLORS.faint,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 5,
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: 13.5 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: "18px 22px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              background: `${COLORS.amber}10`,
              border: `1px solid ${COLORS.amber}40`,
              borderRadius: 4,
              padding: "12px 14px",
            }}
          >
            <PlayCircle size={18} color={COLORS.amber} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>
                생산 중인 실적입니다
              </div>
              <div style={{ fontSize: 12.5, color: COLORS.muted, lineHeight: 1.5 }}>
                생산 완료 처리 시 해당 설비가 대기 상태로 전환되고, 실적이 완료 상태로 집계됩니다.
                현장 작업이 모두 끝났는지 확인한 뒤 완료해 주세요.
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 22px",
            borderTop: `1px solid ${COLORS.hairline}`,
          }}
        >
          {confirmingComplete ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: COLORS.green }}>
                이 생산을 완료 처리할까요?
              </span>
              <button
                onClick={() => onComplete(production.productionId)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: `${COLORS.green}20`,
                  border: `1px solid ${COLORS.green}`,
                  color: COLORS.green,
                  borderRadius: 4,
                  padding: "6px 12px",
                  fontSize: 11.5,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Check size={12} />
                완료 확정
              </button>
              <button
                onClick={() => setConfirmingComplete(false)}
                style={{
                  background: "transparent",
                  border: `1px solid ${COLORS.hairline}`,
                  color: COLORS.muted,
                  borderRadius: 4,
                  padding: "6px 12px",
                  fontSize: 11.5,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                취소
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingComplete(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: `${COLORS.green}18`,
                border: `1px solid ${COLORS.green}66`,
                color: COLORS.green,
                borderRadius: 4,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <CheckCircle2 size={13} />
              생산 완료
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: `1px solid ${COLORS.hairline}`,
              color: COLORS.text,
              borderRadius: 4,
              padding: "8px 16px",
              fontSize: 12.5,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductionDetailCard;
