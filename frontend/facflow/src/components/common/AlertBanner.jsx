// src/components/common/AlertBanner.jsx
// 경고 알림 배너 컴포넌트

import React from "react";
import { TriangleAlert } from "lucide-react";

function AlertBanner({ show, title, description }) {
  if (!show) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        background: "rgba(229,72,77,0.08)",
        border: "1px solid var(--color-red)",
        borderRadius: 4,
        padding: "12px 16px",
        marginBottom: 20,
      }}
    >
      <TriangleAlert
        size={18}
        color="var(--color-red)"
        style={{ marginTop: 2, flexShrink: 0 }}
      />
      <div>
        <div className="text-error" style={{ fontWeight: 600 }}>
          {title}
        </div>
        {description && (
          <div className="text-body-muted" style={{ marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertBanner;
