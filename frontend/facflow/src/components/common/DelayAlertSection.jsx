import React from "react";
import { AlertTriangle } from "lucide-react";
import { COLORS } from "../../constants/colors";

export default function DelayAlertSection({ severity, count, title, children, Icon = AlertTriangle }) {
  const color = severity === "critical" ? COLORS.red : COLORS.amber;

  return (
    <div
      style={{
        marginBottom: 20,
        border: `1px solid ${color}40`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 4,
        background: `${color}0D`,
        padding: 12,
      }}
    >
      <div
        className="text-alert-title"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginBottom: 10,
          color,
          paddingLeft: 4,
        }}
      >
        <Icon size={15} />
        {count}건의 {title}
      </div>
      {children}
    </div>
  );
}
