const { logger } = require("../../config/winston");

const planService = require("../services/planService");

exports.getPlan = async function (req, res) {
  try {
    const planDate = req.query.planDate;
    const result = await planService.getPlan(planDate);

    return res.send({
      result: result,
      isSuccess: true,
      code: 200,
      message: "요청 성공",
    });

  } catch (err) {
    logger.error(`getPlan Controller error\n: ${JSON.stringify(err)}`);

    return res.send({
      result: null,
      isSuccess: false,
      code: 500,
      message: "서버 오류",
    });
  }
};

exports.createPlan = async function (req, res) {
  try {
    const { productId, planDate, dueDate, targetQty } = req.body;
    //validation + error handling 추가 예정

    const result = await planService.createPlan(productId, planDate, dueDate, targetQty);
   
    return res.send({
      result: result,
      isSuccess: true,
      code: 200,
      message: "요청 성공",
    });
  }
 catch (err) {
    logger.error(`createPlan Controller error\n: ${JSON.stringify(err)}`);

    return res.send({
      result: null,
      isSuccess: false,
      code: 500,
      message: "서버 오류",
    });
  }
};

exports.updatePlanStatus = async function (req, res) {
  try {
    const planId = req.params.planId;
    const { status } = req.body;
    //validation + error handling 추가 예정

    const result = await planService.updatePlanStatus(planId, status);
    return res.send({
      result: result,
      isSuccess: true,
      code: 200,
      message: "요청 성공",
    });
  } catch (err) {
    logger.error(`updatePlan Controller error\n: ${JSON.stringify(err)}`);
    return res.send({
      result: null,
      isSuccess: false,
      code: 500,
      message: "서버 오류",
    });
  }
};

exports.startPlan = async function (req, res) {
  try {
    const planId = req.params.planId;
    const { equipmentId } = req.body;
    //validation + error handling 추가 예정

    const result = await planService.startPlan(planId, equipmentId);
    
    return res.send({
      result: result,
      isSuccess: true,
      code: 200,
      message: "요청 성공",
    });
  } catch (err) {
    logger.error(`startPlan Controller error\n: ${JSON.stringify(err)}`);
    return res.send({
      result: null,
      isSuccess: false,
      code: 500,
      message: "서버 오류",
    });
  }
};

exports.getAvailableEquipment = async function (req, res) {
  try {
    const planId = req.params.planId;
    const result = await planService.getAvailableEquipment(planId);
    return res.send({
      result: result,
      isSuccess: true,
      code: 200,
      message: "요청 성공",
    });
  } catch (err) {
    logger.error(`getAvailableEquipment Controller error\n: ${JSON.stringify(err)}`);
    return res.send({
      result: null,
      isSuccess: false,
      code: 500,
      message: "서버 오류",
    });
  }
};

exports.resumeHaltedPlan = async function (req, res) {
  try {
    const planId = req.params.planId;
    const { equipmentId } = req.body;

    const result = await planService.resumeHaltedPlan(planId, equipmentId);

    return res.send({
      result: result,
      isSuccess: true,
      code: 200,
      message: "요청 성공",
    });
  } catch (err) {
    logger.error(`resumeHaltedPlan Controller error\n: ${JSON.stringify(err)}`);

    if (err.message === "PLAN_NOT_FOUND") {
      return res.send({
        result: null,
        isSuccess: false,
        code: 404,
        message: "계획을 찾을 수 없습니다.",
      });
    }
    if (err.message === "PLAN_NOT_HALT") {
      return res.send({
        result: null,
        isSuccess: false,
        code: 400,
        message: "중단된 계획만 재시작할 수 있습니다.",
      });
    }
    if (err.message === "NO_REMAINING_QTY") {
      return res.send({
        result: null,
        isSuccess: false,
        code: 400,
        message: "재시작할 남은 수량이 없습니다.",
      });
    }

    return res.send({
      result: null,
      isSuccess: false,
      code: 500,
      message: "서버 오류",
    });
  }
};