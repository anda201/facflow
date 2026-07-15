const { logger } = require("../../config/winston");

const productService = require("../services/productService");

exports.getProducts = async function (req, res) {
  try {
    const result = await productService.getProducts();

    return res.send({
      result: result,
      isSuccess: true,
      code: 200,
      message: "요청 성공",
    });
  } catch (err) {
    logger.error(`getProducts Controller error\n: ${JSON.stringify(err)}`);

    return res.send({
      result: null,
      isSuccess: false,
      code: 500,
      message: "서버 오류",
    });
  }
};
