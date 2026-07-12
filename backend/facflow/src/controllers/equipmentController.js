const { logger } = require("../../config/winston");

const equipmentService = require("../services/equipmentService");

// 예시 코드
exports.getEquipment = async function (req, res) {
  try {
    const result = await equipmentService.getEquipment();

    return res.send({
      result: result,
      isSuccess: true,
      code: 200,
      message: "요청 성공",
    });

  } catch (err) {
    logger.error(`getEquipment Controller error\n: ${JSON.stringify(err)}`);

    return res.send({
      result: null,
      isSuccess: false,
      code: 500,
      message: "서버 오류",
    });
  }
};

exports.getIdleEquipment = async function (req, res) {
    try {
        const result = await equipmentService.getIdleEquipment();

        return res.send({
            result: result,
            isSuccess: true,
            code: 200,
            message: "요청 성공",
        });
    }
    catch (err) {
        logger.error(`getIdleEquipment Controller error\n: ${JSON.stringify(err)}`);

        return res.send({
            result: null,
            isSuccess: false,
            code: 500,
            message: "서버 오류",
        });
    }
};