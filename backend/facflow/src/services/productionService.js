const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const productionDao = require("../dao/productionDao");
const equipmentDao = require("../dao/equipmentDao");
const planDao = require("../dao/planDao");
const { generateProductionQty } = require("../utils/productionQtyGenerator");
const { today } = require("../utils/date")

exports.getProduction = async function (productionDate) {
  const date = productionDate || today();

  let connection;

  try {
    connection = await pool.getConnection(async (conn) => conn);

  } catch (err) {
    logger.error(`getProduction DB Connection error\n: ${JSON.stringify(err)}`);

    throw err;
  }

  try {
    const [summary, productions, overdueProductions] = await Promise.all([
      productionDao.selectProductionSummary(connection, date),
      productionDao.selectProductionList(connection, date),
      productionDao.selectOverdueProductionList(connection),
    ]);

    return {
      summary: summary[0],
      productions,
      overdueProductions,
    };

  } catch (err) {
    logger.error(`getProduction DB Query error\n: ${JSON.stringify(err)}`);
    throw err;

  } finally {
    connection.release();
  }
};


exports.endProduction = async function (productionId) {
  let connection;
  try {
    connection = await pool.getConnection(async (conn) => conn);
  } catch (err) {
    logger.error(`endProduction DB Connection error\n: ${JSON.stringify(err)}`);
    throw err;
  }

  try {
    await connection.beginTransaction();

    const productionInfo = await productionDao.selectProductionById(connection, productionId);
    const { goodQty, defectQty } = generateProductionQty(productionInfo.targetQty);
    
    await productionDao.endProduction(connection, productionId, goodQty, defectQty);
    await equipmentDao.updateEquipmentStatus(connection, productionInfo.equipmentId, 'IDLE');
    await planDao.updatePlanStatus(connection, productionInfo.planId, 'DONE');
    
    await connection.commit();
    
    return { productionId, goodQty, defectQty };
  } catch (err) {
    await connection.rollback();

    logger.error(`endProduction DB Query error\n: ${JSON.stringify(err)}`);
    throw err;
  } finally {
    connection.release();
  }
};
