// src/components/plans/PlanDetailCard.jsx
// shell: overlay · header · info · body · footer

import React from "react";
import { X, Ban } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { getPlanQtyContext } from "./planDetailHelpers";
import PlanDetailInfo from "./PlanDetailInfo";
import PlanDetailBody from "./PlanDetailBody";

function PlanDetailCard({
  plan,
  equipment,
  recommendation,
  onClose,
  onStart,
  onCancel,
  onResume,
}) {
  const { producedQty, remainingQty } = getPlanQtyContext(plan);
  const canCancel = plan.status === "WAIT" || plan.status === "HALT";

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "20px 22px 16px",
            borderBottom: `1px solid ${COLORS.hairline}`,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
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
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
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
              flexShrink: 0,
            }}
          >
            <X size={20} />
          </button>
        </div>

        <PlanDetailInfo
          plan={plan}
          producedQty={producedQty}
          remainingQty={remainingQty}
        />

        <div style={{ padding: "18px 22px" }}>
          <PlanDetailBody
            plan={plan}
            equipment={equipment}
            recommendation={recommendation}
            onStart={onStart}
            onResume={onResume}
          />
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
          {canCancel ? (
            <button
              onClick={() => onCancel(plan.planId)}
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
              <Ban size={13} />
              계획 취소
            </button>
          ) : (
            <span />
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

export default PlanDetailCard;
