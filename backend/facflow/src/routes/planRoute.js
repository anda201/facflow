module.exports = function (app) {
    const plan = require("../controllers/planController");
  
    // 라우터 정의: 어떤 요청이 반응을 할지 정의
    // app.HTTP메서드(uri, 컨트롤러 콜백함수)
    app.get("/plan", plan.getPlan);
    app.post("/plan", plan.createPlan);
    app.patch("/plan/:planId", plan.updatePlanStatus);
    app.patch("/plan/:planId/start", plan.startPlan);
  };
  