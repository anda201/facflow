// src/components/dashboard/ProductRanking.jsx
// 품목별 생산 순위 컴포넌트

import React from "react";
import { fmt } from "../../utils/format";

const COLORS = {
  panel: "#1B1F26",
  panelAlt: "#20242C",
  hairline: "#2B313B",
  amber: "#F5A623",
  text: "#EDEFF2",
  muted: "#8A93A3",
  faint: "#565E6B",
};

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
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          품목별 생산 순위
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: COLORS.muted,
          }}
        >
          TOP 5
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {productChart.map((p, i) => (
          <div key={p.productId}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12.5,
                marginBottom: 5,
              }}
            >
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: i === 0 ? COLORS.amber : COLORS.faint,
                    fontSize: 11,
                    width: 16,
                    display: "inline-block",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ color: COLORS.text }}>{p.productName}</span>
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: COLORS.muted,
                }}
              >
                {fmt(p.productionQty)}
              </span>
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
