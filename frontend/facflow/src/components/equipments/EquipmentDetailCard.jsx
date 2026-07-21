import React, { useEffect, useState } from "react";
import { X, ShieldAlert, PackageCheck, AlertTriangle, Gauge, Package } from "lucide-react";
import { StatusBadge } from "../common";
import { EQUIP_META } from "../../constants/statusMeta";
import { COLORS } from "../../constants/colors";
import { fmt, fmtPct, kstDateLabel } from "../../utils/format";
import { getEquipmentDetail } from "../../api";

const EMPTY_DETAIL = {
  productionQty: 0,
  defectQty: 0,
  defectRate: 0,
  products: [],
};

function EquipmentDetailCard({ eq, onClose, onSetStop }) {
  const [detail, setDetail] = useState(EMPTY_DETAIL);
  const [detailLoading, setDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setDetailLoading(true);
        setDetailError(null);
        const result = await getEquipmentDetail(eq.equipmentId);
        setDetail({
          productionQty: result?.productionQty ?? 0,
          defectQty: result?.defectQty ?? 0,
          defectRate: result?.defectRate ?? 0,
          products: result?.products ?? [],
        });
      } catch (e) {
        setDetailError(e);
        setDetail(EMPTY_DETAIL);
      } finally {
        setDetailLoading(false);
      }
    };
    fetchDetail();
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
            <div className="text-card-meta" style={{ marginBottom: 6 }}>
              EQ-{String(eq.equipmentId).padStart(3, "0")}
            </div>
            <div className="text-card-title-lg">{eq.equipmentName}</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--color-muted)", cursor: "pointer", padding: 4 }}
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
          <span className="text-table-date">{kstDateLabel(eq.createdAt)} 등록</span>
        </div>

        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${COLORS.hairline}` }}>
          <div className="text-section-title-sm" style={{ marginBottom: 12 }}>
            최근 30일 생산 실적
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {detailLoading ? (
              <div className="text-table-caption" style={{ gridColumn: "1 / -1", padding: "8px 0" }}>
                생산 실적 불러오는 중...
              </div>
            ) : detailError ? (
              <div className="text-error" style={{ gridColumn: "1 / -1", padding: "8px 0" }}>
                생산 실적을 불러오지 못했습니다.
              </div>
            ) : (
              [
                { label: "생산수", value: fmt(detail.productionQty), unit: "EA", color: COLORS.text, Icon: PackageCheck },
                { label: "불량수", value: fmt(detail.defectQty), unit: "EA", color: COLORS.red, Icon: AlertTriangle },
                {
                  label: "불량률",
                  value: fmtPct(detail.defectRate, 2),
                  unit: "%",
                  color: detail.defectRate > 5 ? COLORS.red : COLORS.amber,
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
                    <span className="text-stat-value" style={{ color: s.color }}>
                      {s.value}
                    </span>
                    <span className="text-stat-unit">{s.unit}</span>
                  </div>
                  <div className="text-stat-label" style={{ marginTop: 3 }}>
                    {s.label}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${COLORS.hairline}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
            <Package size={14} color={COLORS.blue} />
            <div className="text-section-title-sm">생산 가능 제품</div>
          </div>

          {detailLoading ? (
            <div className="text-table-caption" style={{ padding: "4px 0" }}>
              제품 목록 불러오는 중...
            </div>
          ) : detailError ? (
            <div className="text-error" style={{ padding: "4px 0" }}>
              제품 목록을 불러오지 못했습니다.
            </div>
          ) : detail.products.length === 0 ? (
            <div className="text-table-caption" style={{ padding: "4px 0" }}>
              등록된 생산 가능 제품이 없습니다.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflowY: "auto" }}>
              {detail.products.map((product) => (
                <div
                  key={product.productId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    background: COLORS.panelAlt,
                    border: `1px solid ${COLORS.hairline}`,
                    borderRadius: 4,
                    padding: "10px 12px",
                  }}
                >
                  <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="text-equip-code">{product.productCode}</div>
                    <div className="text-section-title-sm">{product.productName}</div>
                  </div>
                  <div className="text-label" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                    {fmt(product.hourlyCapacity)} EA/h
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "18px 22px" }}>
          {eq.status === "STOP" ? (
            <div className="text-notice-faint" style={{ background: COLORS.panelAlt, borderRadius: 4, padding: "12px 14px" }}>
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
                <div className="text-notice">
                  <strong style={{ color: "var(--color-red)" }}>가동중인 설비입니다.</strong>
                  <br />
                  점검 처리하면 진행 중인 생산에 영향을 줄 수 있어요. 계속할까요?
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setConfirming(false)}
                  className="text-btn-muted"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: `1px solid ${COLORS.hairline}`,
                    borderRadius: 4,
                    padding: "9px 0",
                    cursor: "pointer",
                  }}
                >
                  취소
                </button>
                <button
                  onClick={() => onSetStop(eq.equipmentId)}
                  className="text-btn-action"
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
                    cursor: "pointer",
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
              className="text-btn-action"
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
                cursor: "pointer",
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
