// src/components/dashboard/AchievementGauge.jsx
// 목표 달성률 컴포넌트

import React from "react";

const COLORS = {
  bg: "#14171C",
  amber: "#F5A623",
  amberDim: "#8A6320",
  red: "#E5484D",
  green: "#3DDC84",
  text: "#EDEFF2",
  muted: "#8A93A3",
};

function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function arcPath(cx, cy, r, fromDeg, toDeg) {
  const s = polar(cx, cy, r, fromDeg);
  const e = polar(cx, cy, r, toDeg);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`;
}

function AchievementGauge({ value }) {
  const max = 150; // scale extends past 100 so over-achievement is visible
  const target = 100;
  const clipped = Math.max(0, Math.min(value, max));
  const cx = 110;
  const cy = 108;
  const r = 84;

  const toDeg = (v) => 180 - (v / max) * 180;

  const zones = [
    { from: 0, to: 40, color: COLORS.red },
    { from: 40, to: 70, color: COLORS.amberDim },
    { from: 70, to: max, color: COLORS.green },
  ];

  const needleDeg = toDeg(clipped);
  const needleTip = polar(cx, cy, r - 14, needleDeg);
  const targetDeg = toDeg(target);
  const targetOuter = polar(cx, cy, r + 8, targetDeg);
  const targetInner = polar(cx, cy, r - 8, targetDeg);

  const status =
    value >= 100 ? COLORS.green : value >= 70 ? COLORS.amber : COLORS.red;

  return (
    <svg viewBox="0 0 220 130" width="100%" height="100%">
      {zones.map((z, i) => (
        <path
          key={i}
          d={arcPath(cx, cy, r, toDeg(z.from), toDeg(z.to))}
          fill="none"
          stroke={z.color}
          strokeWidth={10}
          strokeLinecap="butt"
          opacity={0.9}
        />
      ))}
      {/* target line at 100% */}
      <line
        x1={targetInner.x}
        y1={targetInner.y}
        x2={targetOuter.x}
        y2={targetOuter.y}
        stroke={COLORS.text}
        strokeWidth={2}
        opacity={0.6}
      />
      <text
        x={polar(cx, cy, r + 20, targetDeg).x}
        y={polar(cx, cy, r + 20, targetDeg).y}
        fill={COLORS.muted}
        fontSize={9}
        fontFamily="'JetBrains Mono', monospace"
        textAnchor="middle"
      >
        100
      </text>
      {/* needle */}
      <line
        x1={cx}
        y1={cy}
        x2={needleTip.x}
        y2={needleTip.y}
        stroke={status}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={6} fill={status} />
      <circle cx={cx} cy={cy} r={2.4} fill={COLORS.bg} />
    </svg>
  );
}

export default AchievementGauge;
