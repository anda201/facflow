// 생산 실적_불량 상세 조회
export const defectRes = {
  productionId: 0,      // 생산 실적 ID

  productName: "",      // 제품명
  equipmentName: "",    // 설비명

  goodQty: 0,           // 양품 수량
  defectQty: 0,         // 총 불량 수량

  defects: [
    {
      defectId: 0,      // 불량 ID
      defectType: "",   // 불량 유형 : 
      qty: 0,           // 불량 수량
    },
  ],
};
