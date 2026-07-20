// src/components/plans/PlanDetailCard.jsx
// 생산 계획 상세 모달 컴포넌트

import React, { useState } from "react";
import {
  X,
  Wrench,
  CircleDot,
  Play,
  PlayCircle,
  Trash2,
  Sparkles,
  Clock,
} from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { COLORS } from "../../constants/colors";
import { PLAN_STATUS_META, EQUIP_META } from "../../constants/statusMeta";
import { fmt, toKstDateInputValue, displayDate, formatEstimatedHours } from "../../utils/format";

function PlanDetailCard({ plan, equipment, recommendation, onClose, onStart, onDelete }) {
  const [selectedEquip, setSelectedEquip] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const canDelete = plan.status === "WAIT";

  const recommendedEquip =
    recommendation && equipment.find((e) => e.equipmentId === recommendation.equipmentId);
  const recommendedAvailable = recommendedEquip?.status === "IDLE";


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
          width: "min(560px, 100%)",
          maxHeight: "88vh",
          overflowY: "auto",
          background: COLORS.panel,
          border: `1px solid ${COLORS.hairline}`,
          borderRadius: 6,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
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
              계획 #{plan.planId} · {plan.productCode}
            </div>
            <div
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {plan.productName}
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

        {/* Info grid */}
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
            ["상태", <StatusBadge status={plan.status} meta={PLAN_STATUS_META} fallback="WAIT" key="s" />],
            ["생산 예정일", displayDate(toKstDateInputValue(plan.planDate))],
            ["목표 수량", `${fmt(plan.targetQty)} EA`],
            ["등록일", toKstDateInputValue(plan.createdAt)],
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

        {/* Action zone */}
        <div style={{ padding: "18px 22px" }}>
          {plan.status === "WAIT" && (
            <>
              {recommendedEquip && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    background: `${COLORS.amber}12`,
                    border: `1px solid ${COLORS.amber}55`,
                    borderRadius: 5,
                    padding: "11px 12px",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 5,
                        background: `${COLORS.amber}20`,
                        border: `1px solid ${COLORS.amber}55`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Sparkles size={15} color={COLORS.amber} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 9.5,
                          color: COLORS.amber,
                          letterSpacing: "0.08em",
                          marginBottom: 2,
                        }}
                      >
                        추천 설비
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600 }}>
                          {recommendedEquip.equipmentName}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 11,
                            color: COLORS.muted,
                          }}
                        >
                          <Clock size={11} />
                          약 {formatEstimatedHours(recommendation.estimatedHours)} 소요
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!recommendedAvailable}
                    onClick={() => setSelectedEquip(recommendedEquip.equipmentId)}
                    style={{
                      flexShrink: 0,
                      background: recommendedAvailable ? COLORS.amber : COLORS.panelAlt,
                      border: `1px solid ${recommendedAvailable ? COLORS.amber : COLORS.hairline}`,
                      color: recommendedAvailable ? "#1A1300" : COLORS.faint,
                      borderRadius: 4,
                      padding: "7px 12px",
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: recommendedAvailable ? "pointer" : "not-allowed",
                      fontFamily: "'Inter', sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {recommendedAvailable ? "이 설비로 선택" : "사용중"}
                  </button>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 12,
                }}
              >
                <Wrench size={14} color={COLORS.amber} />
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  장비 선택
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10.5,
                    color: COLORS.faint,
                  }}
                >
                  · 대기중 장비만 선택 가능
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 8,
                  maxHeight: 240,
                  overflowY: "auto",
                  marginBottom: 16,
                  paddingRight: 2,
                }}
              >
                {equipment.map((eq) => {
                  const em = EQUIP_META[eq.status];
                  const disabled = eq.status !== "IDLE";
                  const selected = selectedEquip === eq.equipmentId;
                  const isRecommended = recommendation?.equipmentId === eq.equipmentId;
                  return (
                    <button
                      key={eq.equipmentId}
                      disabled={disabled}
                      onClick={() => setSelectedEquip(eq.equipmentId)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                        background: selected ? `${COLORS.amber}18` : COLORS.panelAlt,
                        border: `1px solid ${
                          selected
                            ? COLORS.amber
                            : isRecommended
                            ? `${COLORS.amber}70`
                            : COLORS.hairline
                        }`,
                        borderRadius: 4,
                        padding: "8px 10px",
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.45 : 1,
                        textAlign: "left",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 13,
                            color: selected ? COLORS.amber : COLORS.text,
                          }}
                        >
                          {isRecommended && <Sparkles size={10} color={COLORS.amber} />}
                          {eq.equipmentName}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            marginTop: 4,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 11,
                            color: COLORS.muted,
                          }}
                        >
                          <Clock size={10} />
                          약 {formatEstimatedHours(eq.estimatedHours)} 소요
                        </span>
                      </div>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 10,
                          color: em.color,
                          fontFamily: "'JetBrains Mono', monospace",
                          flexShrink: 0,
                        }}
                      >
                        <CircleDot size={9} />
                        {em.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                disabled={!selectedEquip}
                onClick={() => onStart(plan.planId, selectedEquip)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  background: selectedEquip ? COLORS.amber : COLORS.panelAlt,
                  border: `1px solid ${selectedEquip ? COLORS.amber : COLORS.hairline}`,
                  color: selectedEquip ? "#1A1300" : COLORS.faint,
                  borderRadius: 4,
                  padding: "11px 0",
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: selectedEquip ? "pointer" : "not-allowed",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Play size={14} />
                {selectedEquip
                  ? `${equipment.find((e) => e.equipmentId === selectedEquip)?.equipmentName}(으)로 생산 시작`
                  : "장비를 선택하세요"}
              </button>
            </>
          )}

          {plan.status === "RUN" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: `${COLORS.amber}10`,
                border: `1px solid ${COLORS.amber}40`,
                borderRadius: 4,
                padding: "12px 14px",
              }}
            >
              <PlayCircle size={18} color={COLORS.amber} />
              <div style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 2 }}>
                생산 중인 계획입니다.
              </div>
            </div>
          )}

          {(plan.status === "DONE" || plan.status === "CANCEL") && (
            <div
              style={{
                fontSize: 12.5,
                color: COLORS.faint,
                background: COLORS.panelAlt,
                borderRadius: 4,
                padding: "12px 14px",
              }}
            >
              {plan.status === "DONE"
                ? "생산이 완료된 계획입니다."
                : "취소된 계획입니다."}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 22px",
            borderTop: `1px solid ${COLORS.hairline}`,
          }}
        >
          {canDelete && (confirmingDelete ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: COLORS.red }}>
                이 계획을 삭제할까요?
              </span>
              <button
                onClick={() => onDelete(plan.planId)}
                style={{
                  background: `${COLORS.red}20`,
                  border: `1px solid ${COLORS.red}`,
                  color: COLORS.red,
                  borderRadius: 4,
                  padding: "6px 12px",
                  fontSize: 11.5,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                삭제 확정
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
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
              onClick={() => setConfirmingDelete(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "transparent",
                border: `1px solid ${COLORS.hairline}`,
                color: COLORS.muted,
                borderRadius: 4,
                padding: "8px 14px",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Trash2 size={13} />
              계획 삭제
            </button>
          ))}
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

export default PlanDetailCard;
