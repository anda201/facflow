const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const productDao = require("../dao/productDao");

exports.getProducts = async function () {
  let connection;

  try {
    connection = await pool.getConnection(async (conn) => conn);
  } catch (err) {
    logger.error(`getProducts DB Connection error\n: ${JSON.stringify(err)}`);
    throw err;
  }

  try {
    const products = await productDao.selectProductList(connection);
    return products;
  } catch (err) {
    logger.error(`getProducts DB Query error\n: ${JSON.stringify(err)}`);
    throw err;
  } finally {
    connection.release();
  }
};
