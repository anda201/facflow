const { logger } = require("../../config/winston");

const productionService = require("../services/productionService");

exports.getProduction = async function (req, res) {
  try {
    const productionDate = req.query.productionDate;
    const result = await productionService.getProduction(productionDate);

    return res.send({
      result: result,
      isSuccess: true,
      code: 200,
      message: "요청 성공",
    });

  } catch (err) {
    logger.error(`getProduction Controller error\n: ${JSON.stringify(err)}`);

    return res.send({
      result: null,
      isSuccess: false,
      code: 500,
      message: "서버 오류",
    });
  }
};

exports.endProduction = async function (req, res) {
  try {
    const productionId = req.params.productionId;
    const result = await productionService.endProduction(productionId);
    
    return res.send({
      result: result,
      isSuccess: true,
      code: 200,
      message: "요청 성공",
    });
  } catch (err) {
    logger.error(`endProduction Controller error\n: ${JSON.stringify(err)}`);

    return res.send({
      result: null,
      isSuccess: false,
      code: 500,
      message: "서버 오류",
    });
  }
};