const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const planDao = require("../dao/planDao");

const getTodayDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 10);
};

exports.getPlan = async function (planDate) {
  const date = planDate || getTodayDate();

  let connection;

  try {
    connection = await pool.getConnection(async (conn) => conn);

  } catch (err) {
    logger.error(`getPlan DB Connection error\n: ${JSON.stringify(err)}`);

    throw err;
  }

  try {
    const summary = await planDao.selectPlanSummary(connection, date);
    const plans = await planDao.selectPlanList(connection, date);

    return {
      summary: summary[0],
      plans,
    };

  } catch (err) {
    logger.error(`getPlan DB Query error\n: ${JSON.stringify(err)}`);
    throw err;

  } finally {
    connection.release();
  }
};


exports.createPlan = async function (productId, planDate, targetQty) {
    let connection;
    
    try {
        connection = await pool.getConnection(async (conn) => conn);
    
    } catch (err) {
        logger.error(`createPlan DB Connection error\n: ${JSON.stringify(err)}`);
    
        throw err;
    }

    try {
        const result = await planDao.insertPlan(connection, productId, planDate, targetQty);
        return result.insertId;

    } catch (err) {
        logger.error(`createPlan DB Query error\n: ${JSON.stringify(err)}`);
        throw err;

    } finally {
        connection.release();
    }
};


exports.updatePlan = async function (planId, status) {
    let connection;
    try {
        connection = await pool.getConnection(async (conn) => conn);
    } catch (err) {
        logger.error(`updatePlan DB Connection error\n: ${JSON.stringify(err)}`);
        throw err;
    }

    try {
        const result = await planDao.updatePlan(connection, planId, status);
        return result;
    
    } catch (err) {
        logger.error(`updatePlan DB Query error\n: ${JSON.stringify(err)}`);
        throw err;
    
    } finally {
        connection.release();
    }
};