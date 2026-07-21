import React from "react";
import { COLORS } from "../../constants/colors";

function PageHeader({ title, subtitle, icon: Icon, children }) {
  return (
    <div
      className="page-header-sticky"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
          <Icon size={20} color={COLORS.amber} />
        </div>
        <div>
          <div className="text-page-title" style={{ letterSpacing: "0.02em" }}>
            {title}
          </div>
          <div className="text-page-subtitle" style={{ marginTop: 2 }}>
            {subtitle}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default PageHeader;
