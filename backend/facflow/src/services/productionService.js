const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const productionDao = require("../dao/productionDao");

const getTodayDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 10);
};

exports.getProduction = async function (productionDate) {
  const date = productionDate || getTodayDate();

  let connection;

  try {
    connection = await pool.getConnection(async (conn) => conn);

  } catch (err) {
    logger.error(`getProduction DB Connection error\n: ${JSON.stringify(err)}`);

    throw err;
  }

  try {
    const summary = await productionDao.selectProductionSummary(connection, date);
    const productions = await productionDao.selectProductionList(connection, date);

    return {
      summary: summary[0],
      productions,
    };

  } catch (err) {
    logger.error(`getProduction DB Query error\n: ${JSON.stringify(err)}`);
    throw err;

  } finally {
    connection.release();
  }
};