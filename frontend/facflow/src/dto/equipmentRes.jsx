// 설비 현황 요약 데이터
export const equipmentRes = {
  summary: {
    totalEquipment: 0,     // 전체 설비 수
    runningEquipment: 0,   // 가동중 설비 수 (RUNNING)
    idleEquipment: 0,      // 대기 설비 수 (IDLE)
    stoppedEquipment: 0,   // 정지/점검 설비 수 (STOP)
  },

  // 설비 목록 데이터
  equipments: [
    {
      equipmentId: 0,      // 설비 ID
      equipmentName: "",   // 설비명
      status: "",           // 설비 상태 (RUNNING/IDLE/STOP)
      createdAt: "",        // 설비 등록일
    },
  ],
};

