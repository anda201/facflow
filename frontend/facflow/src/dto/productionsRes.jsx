// 생산 실적 현황 요약 데이터
export const productionRes = {
  summary: {
    totalProductionQty: 0, // 전체 생산량
    totalGoodQty: 0,       // 전체 양품 수량
    totalDefectQty: 0,     // 전체 불량 수량
    defectRate: 0,         // 불량률
  },

  productions: [
    {
      productionId: 0,     // 생산 실적 ID

      productId: 0,        // 제품 ID
      productName: "",     // 제품명

      equipmentId: 0,      // 설비 ID
      equipmentName: "",   // 설비명

      startTime: "",       // 생산 시작 시간
      endTime: "",         // 생산 종료 시간

      goodQty: 0,          // 양품 수량
      defectQty: 0,        // 불량 수량

      status: "",          // 생산 상태 (RUNNING/DONE)
    },
  ],
};