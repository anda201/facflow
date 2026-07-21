const MIN_DEFECT_RATE = 0;
const MAX_DEFECT_RATE = 0.05;

/**
 * targetQty 기준으로 불량률 0~5% 수준의 goodQty, defectQty 생성
 * goodQty + defectQty = targetQty
 */
exports.generateProductionQty = function (targetQty) {
  if (!targetQty || targetQty <= 0) {
    return { goodQty: 0, defectQty: 0 };
  }

  const defectRate =
    MIN_DEFECT_RATE + Math.random() * (MAX_DEFECT_RATE - MIN_DEFECT_RATE);
  const defectQty = Math.min(
    targetQty,
    Math.round(targetQty * defectRate)
  );
  const goodQty = targetQty - defectQty;

  return { goodQty, defectQty };
};


exports.generateHaltedProductionQty = function (targetQty) {
  const producedQty = Math.max(0, Math.round(Number(targetQty) * 0.2));
  return {
    producedQty,
    ...exports.generateProductionQty(producedQty),
  };
};
