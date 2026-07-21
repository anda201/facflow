export function getPlanQtyContext(plan) {
  const producedQty = Number(plan.goodQty ?? 0) + Number(plan.defectQty ?? 0);
  const remainingQty =
    plan.remainingQty ?? Math.max(0, Number(plan.targetQty) - producedQty);
  const hoursScale = plan.targetQty > 0 ? remainingQty / plan.targetQty : 1;

  return { producedQty, remainingQty, hoursScale };
}

export function getRecommendedEquipment(equipment, recommendation) {
  if (!recommendation) return { recommendedEquip: null, recommendedAvailable: false };
  const recommendedEquip = equipment.find(
    (e) => e.equipmentId === recommendation.equipmentId
  );
  return {
    recommendedEquip: recommendedEquip ?? null,
    recommendedAvailable: recommendedEquip?.status === "IDLE",
  };
}
