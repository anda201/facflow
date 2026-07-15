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