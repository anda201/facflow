import React from "react";
import { CalendarDays } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { displayDate } from "../../utils/format";

function DateStatusToolbar({
  selectedDate,
  onDateChange,
  onTodayClick,
  statusFilter,
  onStatusFilterChange,
  statusFilters,
}) {
  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.hairline}`,
        borderRadius: 4,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <CalendarDays size={16} color={COLORS.muted} />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          style={{
            background: COLORS.panelAlt,
            border: `1px solid ${COLORS.hairline}`,
            borderRadius: 4,
            color: COLORS.text,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12.5,
            padding: "7px 10px",
            colorScheme: "dark",
          }}
        />
        <button
          onClick={onTodayClick}
          style={{
            background: "transparent",
            border: `1px solid ${COLORS.hairline}`,
            color: COLORS.muted,
            borderRadius: 4,
            padding: "7px 12px",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          오늘
        </button>
        <div style={{ fontSize: 12.5, color: COLORS.muted, marginLeft: 4 }}>
          {displayDate(selectedDate)}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {statusFilters.map((c) => (
          <button
            key={c.key}
            onClick={() => onStatusFilterChange(c.key)}
            style={{
              background: statusFilter === c.key ? `${c.color}20` : "transparent",
              border: `1px solid ${statusFilter === c.key ? c.color : COLORS.hairline}`,
              color: statusFilter === c.key ? c.color : COLORS.muted,
              borderRadius: 3,
              padding: "6px 12px",
              fontSize: 11.5,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: "pointer",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DateStatusToolbar;
