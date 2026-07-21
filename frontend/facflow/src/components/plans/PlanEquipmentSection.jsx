import React from "react";
import { Sparkles, Clock, Wrench, CircleDot } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { EQUIP_META } from "../../constants/statusMeta";
import { formatEstimatedHours } from "../../utils/format";

/** 추천 배너 + 설비 선택 그리드 (WAIT/HALT 공통 폼 영역) */
export default function PlanEquipmentSection({
  equipment,
  recommendation,
  recommendedEquip,
  recommendedAvailable,
  selectedEquip,
  onSelectEquip,
  hoursScale = 1,
  title = "장비 선택",
  subtitle = "· 대기중 장비만 선택 가능",
  maxHeight = 240,
}) {
  const recommendedHours =
    recommendation && Number(recommendation.estimatedHours) * hoursScale;

  return (
    <>
      {recommendedEquip && recommendation && (
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
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
            <div style={{ minWidth: 0, flex: 1 }}>
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
              <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: 15,
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
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
                    whiteSpace: "nowrap",
                  }}
                >
                  <Clock size={11} style={{ flexShrink: 0 }} />
                  약 {formatEstimatedHours(recommendedHours)} 소요
                </span>
              </div>
            </div>
          </div>
          <button
            disabled={!recommendedAvailable}
            onClick={() => onSelectEquip(recommendedEquip.equipmentId)}
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

      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
        <Wrench size={14} color={COLORS.amber} />
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 600 }}>
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              color: COLORS.faint,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 8,
          maxHeight,
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
          const estimatedHours = Number(eq.estimatedHours) * hoursScale;

          return (
            <button
              key={eq.equipmentId}
              disabled={disabled}
              onClick={() => onSelectEquip(eq.equipmentId)}
              style={{
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
                gap: 8,
                background: selected ? `${COLORS.amber}18` : COLORS.panelAlt,
                border: `1px solid ${
                  selected ? COLORS.amber : isRecommended ? `${COLORS.amber}70` : COLORS.hairline
                }`,
                borderRadius: 4,
                padding: "8px 10px",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.45 : 1,
                textAlign: "left",
                minWidth: 0,
              }}
            >
              <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13,
                    color: selected ? COLORS.amber : COLORS.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isRecommended && (
                    <Sparkles size={10} color={COLORS.amber} style={{ flexShrink: 0 }} />
                  )}
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    {eq.equipmentName}
                  </span>
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
                    whiteSpace: "nowrap",
                  }}
                >
                  <Clock size={10} style={{ flexShrink: 0 }} />
                  약 {formatEstimatedHours(estimatedHours)} 소요
                </span>
              </div>
              <span
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 4,
                  fontSize: 10,
                  color: em.color,
                  fontFamily: "'JetBrains Mono', monospace",
                  flexShrink: 0,
                  paddingTop: 2,
                }}
              >
                <CircleDot size={9} />
                {em.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
