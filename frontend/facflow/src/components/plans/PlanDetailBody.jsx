import React, { useState } from "react";
import { Play, PlayCircle } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { fmt } from "../../utils/format";
import { getPlanQtyContext, getRecommendedEquipment } from "./planDetailHelpers";
import PlanEquipmentSection from "./PlanEquipmentSection";

/** 상태별 본문 + 액션 버튼 (DetailCard의 body) */
export default function PlanDetailBody({
  plan,
  equipment,
  recommendation,
  onStart,
  onResume,
}) {
  const [selectedEquip, setSelectedEquip] = useState(null);

  const { producedQty, remainingQty, hoursScale } = getPlanQtyContext(plan);
  const { recommendedEquip, recommendedAvailable } = getRecommendedEquipment(
    equipment,
    recommendation
  );
  const selectedName = equipment.find((e) => e.equipmentId === selectedEquip)?.equipmentName;

  if (plan.status === "WAIT") {
    return (
      <>
        <PlanEquipmentSection
          equipment={equipment}
          recommendation={recommendation}
          recommendedEquip={recommendedEquip}
          recommendedAvailable={recommendedAvailable}
          selectedEquip={selectedEquip}
          onSelectEquip={setSelectedEquip}
        />
        <button
          disabled={!selectedEquip}
          onClick={() => onStart(plan.planId, selectedEquip)}
          className="text-btn-action"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            background: selectedEquip ? COLORS.amber : COLORS.panelAlt,
            border: `1px solid ${selectedEquip ? COLORS.amber : COLORS.hairline}`,
            color: selectedEquip ? "#1A1300" : "var(--color-faint)",
            borderRadius: 4,
            padding: "11px 0",
            cursor: selectedEquip ? "pointer" : "not-allowed",
          }}
        >
          <Play size={14} />
          {selectedEquip ? `${selectedName}(으)로 생산 시작` : "장비를 선택하세요"}
        </button>
      </>
    );
  }

  if (plan.status === "HALT") {
    return (
      <>
        <div
          className="text-notice"
          style={{
            background: `${COLORS.red}10`,
            border: `1px solid ${COLORS.red}44`,
            borderRadius: 4,
            padding: "12px 14px",
            marginBottom: 16,
          }}
        >
          설비 점검으로 생산이 중단되었습니다.
          <br />
          목표 {fmt(plan.targetQty)} EA 중 {fmt(producedQty)} EA 생산 ·{" "}
          <strong style={{ color: "var(--color-red)" }}>잔량 {fmt(remainingQty)} EA</strong>
        </div>
        <PlanEquipmentSection
          equipment={equipment}
          recommendation={recommendation}
          recommendedEquip={recommendedEquip}
          recommendedAvailable={recommendedAvailable}
          selectedEquip={selectedEquip}
          onSelectEquip={setSelectedEquip}
          hoursScale={hoursScale}
          title="남은 수량으로 재시작"
          subtitle={null}
          maxHeight={200}
        />
        <button
          disabled={!selectedEquip || remainingQty <= 0}
          onClick={() => onResume(plan.planId, selectedEquip)}
          className="text-btn-action"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            background: selectedEquip && remainingQty > 0 ? COLORS.amber : COLORS.panelAlt,
            border: `1px solid ${selectedEquip && remainingQty > 0 ? COLORS.amber : COLORS.hairline}`,
            color: selectedEquip && remainingQty > 0 ? "#1A1300" : "var(--color-faint)",
            borderRadius: 4,
            padding: "11px 0",
            cursor: selectedEquip && remainingQty > 0 ? "pointer" : "not-allowed",
          }}
        >
          <Play size={14} />
          {remainingQty > 0 ? `잔량 ${fmt(remainingQty)} EA로 재시작` : "재시작할 수량 없음"}
        </button>
      </>
    );
  }

  if (plan.status === "RUN") {
    return (
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
        <div className="text-notice-muted">생산 중인 계획입니다.</div>
      </div>
    );
  }

  if (plan.status === "DONE" || plan.status === "CANCEL") {
    return (
      <div
        className="text-notice-faint"
        style={{
          background: COLORS.panelAlt,
          borderRadius: 4,
          padding: "12px 14px",
        }}
      >
        {plan.status === "DONE" ? "생산이 완료된 계획입니다." : "취소된 계획입니다."}
      </div>
    );
  }

  return null;
}
