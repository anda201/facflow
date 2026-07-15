// src/components/plans/CreatePlanForm.jsx
// 새 생산 계획 등록 폼 컴포넌트

import React, { useState } from "react";
import { X } from "lucide-react";
import { COLORS } from "../../constants/colors";

function CreatePlanForm({ products, defaultDate, serverError, onCancel, onCreate }) {
  const [productId, setProductId] = useState(
    String(products[0]?.productId ?? "")
  );
  const [planDate, setPlanDate] = useState(defaultDate);
  const [dueDate, setDueDate] = useState(defaultDate);
  const [targetQty, setTargetQty] = useState("");
  const [error, setError] = useState("");

  const inputStyle = {
    background: COLORS.panelAlt,
    border: `1px solid ${COLORS.hairline}`,
    borderRadius: 4,
    color: COLORS.text,
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    padding: "9px 10px",
    width: "100%",
    boxSizing: "border-box",
    colorScheme: "dark",
  };

  const labelStyle = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10.5,
    color: COLORS.muted,
    letterSpacing: "0.05em",
    marginBottom: 6,
    display: "block",
    textTransform: "uppercase",
  };

  function submit() {
    const qty = Number(targetQty);
    if (!planDate) {
      setError("생산 예정일을 선택하세요.");
      return;
    }
    if (!dueDate) {
      setError("생산 완료일을 선택하세요.");
      return;
    }
    if (!qty || qty <= 0) {
      setError("목표 수량을 1 이상으로 입력하세요.");
      return;
    }
    const product = products.find((p) => String(p.productId) === productId);
    if (!product) {
      setError("제품을 선택하세요.");
      return;
    }
    onCreate({
      productId: product.productId,
      planDate,
      dueDate,
      targetQty: qty,
    });
  }

  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.amber}55`,
        borderRadius: 4,
        padding: "18px 20px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          새 생산 계획 등록
        </div>
        <button
          onClick={onCancel}
          style={{
            background: "transparent",
            border: "none",
            color: COLORS.muted,
            cursor: "pointer",
            display: "flex",
          }}
        >
          <X size={18} />
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <div>
          <label style={labelStyle}>제품</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            style={inputStyle}
          >
            {products.map((p) => (
              <option key={p.productId} value={p.productId}>
                {p.productCode} · {p.productName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>생산 예정일</label>
          <input
            type="date"
            value={planDate}
            onChange={(e) => setPlanDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>생산 완료일</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>목표 수량 (EA)</label>
          <input
            type="number"
            min="1"
            placeholder="예: 500"
            value={targetQty}
            onChange={(e) => setTargetQty(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {(error || serverError) && (
        <div style={{ color: COLORS.red, fontSize: 12, marginBottom: 12 }}>
          {error || serverError}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          onClick={onCancel}
          style={{
            background: "transparent",
            border: `1px solid ${COLORS.hairline}`,
            color: COLORS.muted,
            borderRadius: 4,
            padding: "8px 16px",
            fontSize: 12.5,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          취소
        </button>
        <button
          onClick={submit}
          style={{
            background: COLORS.amber,
            border: `1px solid ${COLORS.amber}`,
            color: "#1A1300",
            borderRadius: 4,
            padding: "8px 18px",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          계획 등록
        </button>
      </div>
    </div>
  );
}

export default CreatePlanForm;
