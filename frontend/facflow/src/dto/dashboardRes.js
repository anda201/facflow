// 제품별 생산량 차트 데이터
const productChartRes = {
    productId: 0,          // 제품 ID
    productName: "",       // 제품명
    productionQty: 0,      // 생산 수량
}

// 주간 생산량 추이 차트 데이터
const weeklyChartRes = {
    date: "",              // 날짜
    productionQty: 0,      // 해당 날짜 생산 수량
}

// 대시보드 응답 데이터
export const dashboardRes = {
    todayProduction: 0,        // 오늘 총 생산량 (Production.goodQty 합계)
    achievementRate: 0,        // 생산 달성률 (오늘·지연 계획 실제 생산량 / 목표량 * 100)
    todayDefect: 0,            // 오늘 불량 수량 (Production.defectQty 합계)
    todayDefectRate: 0,
    equipmentUtilization: 0,   // 설비 가동률 (가동 설비 수 / 전체 설비 수 * 100)

    productChart: [productChartRes], // 제품별 생산량 차트
    weeklyChart: [weeklyChartRes],   // 주간 생산량 추이 차트
};