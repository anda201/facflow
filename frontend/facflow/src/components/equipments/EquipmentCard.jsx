import React from "react";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "../common";
import { EQUIP_META } from "../../constants/statusMeta";
import { COLORS } from "../../constants/colors";
import { getEquipmentTypeIcon } from "../../utils/equipmentIcon";

function EquipmentCard({ eq, onOpen }) {
  const meta = EQUIP_META[eq.status] || EQUIP_META.IDLE;
  const TypeIcon = getEquipmentTypeIcon(eq.equipmentName);
  const rivet = {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "#0B0D10",
    border: `1px solid ${COLORS.hairline}`,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
  };

  return (
    <button
      onClick={() => onOpen(eq.equipmentId)}
      style={{
        position: "relative",
        background: `linear-gradient(160deg, ${COLORS.panelAlt} 0%, ${COLORS.panel} 65%)`,
        border: `1px solid ${COLORS.hairline}`,
        borderRadius: 6,
        padding: "14px 14px 11px",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "inherit",
        color: "inherit",
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.3)",
      }}
    >
      <span style={{ ...rivet, top: 6, left: 6 }} />
      <span style={{ ...rivet, top: 6, right: 6 }} />
      <span style={{ ...rivet, bottom: 6, left: 6 }} />
      <span style={{ ...rivet, bottom: 6, right: 6 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 5,
            background: COLORS.bg,
            border: `1px solid ${COLORS.hairline}`,
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TypeIcon size={17} color={meta.color} />
        </div>
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            marginTop: 4,
            background: meta.color,
            color: meta.color,
            boxShadow: eq.status === "RUN" ? `0 0 9px 2px ${meta.color}` : "none",
            animation: eq.status === "RUN" ? "ledPulse 1.6s ease-in-out infinite" : "none",
          }}
        />
      </div>

      <div className="text-equip-card-code" style={{ marginBottom: 3 }}>
        EQ-{String(eq.equipmentId).padStart(3, "0")}
      </div>
      <div
        className="text-equip-card-title"
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginBottom: 12,
        }}
      >
        {eq.equipmentName}
      </div>

      <div
        style={{
          borderTop: `1px solid ${COLORS.hairline}`,
          boxShadow: "0 -1px 0 rgba(255,255,255,0.03)",
          paddingTop: 9,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <StatusBadge status={eq.status} meta={EQUIP_META} fallback="IDLE" />
        <ChevronRight size={13} color={COLORS.faint} />
      </div>
    </button>
  );
}

export default EquipmentCard;
