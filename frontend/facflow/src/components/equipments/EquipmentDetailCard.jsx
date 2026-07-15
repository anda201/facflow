import React, { useEffect, useState } from "react";
import { X, ShieldAlert, PackageCheck, AlertTriangle, Gauge } from "lucide-react";
import { StatusBadge } from "../common";
import { EQUIP_META } from "../../constants/statusMeta";
import { COLORS } from "../../constants/colors";
import { fmt, fmtPct, kstDateLabel } from "../../utils/format";
import { getEquipmentDetail } from "../../api";

const EMPTY_STATS = {
  productionQty: 0,
  defectQty: 0,
  defectRate: 0,
};

function EquipmentDetailCard({ eq, onClose, onSetStop }) {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const result = await getEquipmentDetail(eq.equipmentId);
        setStats(result ?? EMPTY_STATS);
      } catch (e) {
        setStatsError(e);
        setStats(EMPTY_STATS);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [eq.equipmentId]);

  function handleStopClick() {
    if (eq.status === "RUN") {
      setConfirming(true);
    } else {
      onSetStop(eq.equipmentId);
    }
  }

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
          width: "min(440px, 100%)",
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
              EQ-{String(eq.equipmentId).padStart(3, "0")}
            </div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 21, fontWeight: 600 }}>
              {eq.equipmentName}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 22px",
            borderBottom: `1px solid ${COLORS.hairline}`,
          }}
        >
          <StatusBadge status={eq.status} meta={EQUIP_META} fallback="IDLE" />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11.5,
              color: COLORS.faint,
            }}
          >
            {kstDateLabel(eq.createdAt)} 등록
          </span>
        </div>

        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${COLORS.hairline}` }}>
          <div
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            최근 30일 생산 실적
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {statsLoading ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11.5,
                  color: COLORS.faint,
                  padding: "8px 0",
                }}
              >
                생산 실적 불러오는 중...
              </div>
            ) : statsError ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11.5,
                  color: COLORS.red,
                  padding: "8px 0",
                }}
              >
                생산 실적을 불러오지 못했습니다.
              </div>
            ) : (
              [
                { label: "생산수", value: fmt(stats.productionQty), unit: "EA", color: COLORS.text, Icon: PackageCheck },
                { label: "불량수", value: fmt(stats.defectQty), unit: "EA", color: COLORS.red, Icon: AlertTriangle },
                {
                  label: "불량률",
                  value: fmtPct(stats.defectRate, 2),
                  unit: "%",
                  color: stats.defectRate > 5 ? COLORS.red : COLORS.amber,
                  Icon: Gauge,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: COLORS.panelAlt,
                    border: `1px solid ${COLORS.hairline}`,
                    borderRadius: 4,
                    padding: "12px 10px",
                  }}
                >
                  <s.Icon size={13} color={s.color} style={{ marginBottom: 6 }} />
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, color: s.color }}>
                      {s.value}
                    </span>
                    <span style={{ fontSize: 10.5, color: COLORS.faint }}>{s.unit}</span>
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: COLORS.faint,
                      marginTop: 3,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ padding: "18px 22px" }}>
          {eq.status === "STOP" ? (
            <div
              style={{
                fontSize: 12.5,
                color: COLORS.faint,
                background: COLORS.panelAlt,
                borderRadius: 4,
                padding: "12px 14px",
              }}
            >
              현재 점검중인 설비입니다.
            </div>
          ) : confirming ? (
            <div
              style={{
                background: `${COLORS.red}0f`,
                border: `1px solid ${COLORS.red}55`,
                borderRadius: 4,
                padding: "14px 14px",
              }}
            >
              <div style={{ display: "flex", gap: 9, marginBottom: 12 }}>
                <AlertTriangle size={16} color={COLORS.red} style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 12.5, color: COLORS.text, lineHeight: 1.5 }}>
                  <strong style={{ color: COLORS.red }}>가동중인 설비입니다.</strong>
                  <br />
                  점검 처리하면 진행 중인 생산에 영향을 줄 수 있어요. 계속할까요?
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setConfirming(false)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: `1px solid ${COLORS.hairline}`,
                    color: COLORS.muted,
                    borderRadius: 4,
                    padding: "9px 0",
                    fontSize: 12.5,
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  취소
                </button>
                <button
                  onClick={() => onSetStop(eq.equipmentId)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    background: COLORS.red,
                    border: `1px solid ${COLORS.red}`,
                    color: "#210404",
                    borderRadius: 4,
                    padding: "9px 0",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <ShieldAlert size={13} />
                  점검 처리 확정
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleStopClick}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                background: `${COLORS.red}18`,
                border: `1px solid ${COLORS.red}66`,
                color: COLORS.red,
                borderRadius: 4,
                padding: "11px 0",
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <ShieldAlert size={15} />
              점검 상태로 전환
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EquipmentDetailCard;
