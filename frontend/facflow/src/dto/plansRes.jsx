// 생산 계획 현황 요약 데이터
export const planRes = {
  summary: {
    totalPlans: 0,          // 전체 생산 계획 수
    waitPlans: 0,            // 대기 상태 계획 수 (WAIT)
    runningPlans: 0,         // 진행중 상태 계획 수 (RUNNING)
    completedPlans: 0,       // 완료 상태 계획 수 (DONE)
    canceledPlans: 0,        // 취소 상태 계획 수 (CANCEL)
  },

  // 생산 계획 목록 데이터
  plans: [
    {
      planId: 0,             // 생산 계획 ID
      productId: 0,          // 제품 ID (Product FK)
      productCode: "",       // 제품 코드
      productName: "",       // 제품명
      planDate: "",          // 생산 예정일
      targetQty: 0,          // 목표 생산 수량
      status: "",            // 계획 상태 (WAIT/RUNNING/DONE/CANCEL)
      createdAt: "",         // 계획 등록일
    },
  ],
};