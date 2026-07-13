// src/components/dashboard/WeeklyProductionChart.jsx
// 주간 생산 추이 차트 컴포넌트

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import WeeklyTooltip from "./WeeklyTooltip";
import { weekdayLabel } from "../../utils/format";

const COLORS = {
  panel: "#1B1F26",
  hairline: "#2B313B",
  amber: "#F5A623",
  muted: "#8A93A3",
};

function WeeklyProductionChart({ weeklyChart }) {
  const weekly = weeklyChart.map((d) => ({
    ...d,
    label: weekdayLabel(d.date),
  }));
  const todayIdx = weekly.length - 1;

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
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          주간 생산 추이
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: COLORS.muted,
          }}
        >
          7일 · 단위 EA
        </div>
      </div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={weekly} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid
              vertical={false}
              stroke={COLORS.hairline}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: "Inter" }}
              axisLine={{ stroke: COLORS.hairline }}
              tickLine={false}
            />
            <YAxis
              tick={{
                fill: COLORS.muted,
                fontSize: 10,
                fontFamily: "JetBrains Mono",
              }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip
              content={<WeeklyTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />
            <Bar dataKey="productionQty" radius={[3, 3, 0, 0]}>
              {weekly.map((entry, i) => (
                <Cell
                  key={i}
                  fill={i === todayIdx ? COLORS.amber : "#3A4150"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default WeeklyProductionChart;
