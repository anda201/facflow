// src/components/common/PageHeader.jsx
// 페이지 상단 헤더 (제목, 부제, 상태 배지)

import React from "react";
import { Factory } from "lucide-react";

const COLORS = {
  panel: "#1B1F26",
  hairline: "#2B313B",
  amber: "#F5A623",
  red: "#E5484D",
  green: "#3DDC84",
  muted: "#8A93A3",
};

function PageHeader({ title, subtitle, showAlert }) {
  const statusColor = showAlert ? COLORS.red : COLORS.green;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${COLORS.hairline}`,
        paddingBottom: 18,
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 4,
            background: COLORS.panel,
            border: `1px solid ${COLORS.hairline}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Factory size={20} color={COLORS.amber} />
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: COLORS.muted,
              marginTop: 2,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: statusColor,
          border: `1px solid ${statusColor}`,
          borderRadius: 4,
          padding: "6px 12px",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: statusColor,
            display: "inline-block",
          }}
        />
        {showAlert ? "라인 점검 필요" : "정상 가동"}
      </div>
    </div>
  );
}

export default PageHeader;
