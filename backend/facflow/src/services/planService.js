const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const planDao = require("../dao/planDao");
const equipmentDao = require("../dao/equipmentDao");
const productionDao = require("../dao/productionDao");
const { today } = require("../utils/date")

exports.getPlan = async function (planDate) {
  const date = planDate || today();

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


exports.updatePlanStatus = async function (planId, status) {
    let connection;
    try {
        connection = await pool.getConnection(async (conn) => conn);
    } catch (err) {
        logger.error(`updatePlan DB Connection error\n: ${JSON.stringify(err)}`);
        throw err;
    }

    try {
        const result = await planDao.updatePlanStatus(connection, planId, status);
        return result;
    
    } catch (err) {
        logger.error(`updatePlan DB Query error\n: ${JSON.stringify(err)}`);
        throw err;
    
    } finally {
        connection.release();
    }
};

exports.startPlan = async function (planId, equipmentId) {
    let connection;
    try {
        connection = await pool.getConnection(async (conn) => conn);
    } catch (err) {
        logger.error(`startPlan DB Connection error\n: ${JSON.stringify(err)}`);
        throw err;
    }

    try {
        await connection.beginTransaction();

        await planDao.updatePlanStatus(connection, planId, 'RUN');
        await equipmentDao.updateEquipmentStatus(connection, equipmentId, 'RUN');
        const production = await productionDao.insertProduction(connection, planId, equipmentId);

        await connection.commit();

        return production;

    } catch (err) {
        await connection.rollback();

        logger.error(`startPlan DB Query error\n: ${JSON.stringify(err)}`);
        throw err;

    } finally {
        connection.release();
    }
};