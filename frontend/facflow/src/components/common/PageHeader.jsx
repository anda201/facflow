import React from "react";
import { COLORS } from "../../constants/colors";

function PageHeader({ title, subtitle, icon: Icon, children }) {
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
          <Icon size={20} color={COLORS.amber} />
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
      {children}
    </div>
  );
}

export default PageHeader;
