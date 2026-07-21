// src/components/dashboard/ProductRanking.jsx
// 품목별 생산 순위 컴포넌트

import React from "react";
import { fmt } from "../../utils/format";
import { COLORS } from "../../constants/colors";

function ProductRanking({ productChart }) {
  const maxProduct = Math.max(...productChart.map((p) => p.productionQty));

  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.hairline}`,
        borderRadius: 4,
        padding: "18px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <div className="text-section-title">품목별 생산 순위</div>
        <div className="text-chart-label">TOP 5</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {productChart.map((p, i) => (
          <div key={p.productId}>
            <div className="text-ranking-item" style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className={`text-ranking-rank${i === 0 ? " is-top" : ""}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{p.productName}</span>
              </span>
              <span className="text-ranking-qty">{fmt(p.productionQty)}</span>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: COLORS.panelAlt,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(p.productionQty / maxProduct) * 100}%`,
                  background: i === 0 ? COLORS.amber : "#4A5262",
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductRanking;
