// src/components/plans/PlansHeader.jsx
// 생산 계획 페이지 헤더 컴포넌트

import React from "react";
import { ListTodo, Plus, X } from "lucide-react";
import { COLORS } from "../../constants/colors";

function PlansHeader({ showForm, onToggleForm }) {
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
          <ListTodo size={20} color={COLORS.amber} />
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
            생산 계획 관리
          </div>
        </div>
      </div>

      <button
        onClick={onToggleForm}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          background: showForm ? "transparent" : COLORS.amber,
          border: `1px solid ${COLORS.amber}`,
          color: showForm ? COLORS.amber : "#1A1300",
          borderRadius: 4,
          padding: "9px 16px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {showForm ? <X size={15} /> : <Plus size={15} />}
        {showForm ? "닫기" : "새 계획 등록"}
      </button>
    </div>
  );
}

export default PlansHeader;
