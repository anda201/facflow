const { logger } = require("../../config/winston");

const dashboardService = require("../services/dashboardService");

// 예시 코드
exports.getDashboard = async function (req, res) {
  try {
    const result = await dashboardService.getDashboard();

    return res.send({
      result: result,
      isSuccess: true,
      code: 200,
      message: "요청 성공",
    });

  } catch (err) {
    logger.error(`getDashboard Controller error\n: ${JSON.stringify(err)}`);

    return res.send({
      result: null,
      isSuccess: false,
      code: 500,
      message: "서버 오류",
    });
  }
};