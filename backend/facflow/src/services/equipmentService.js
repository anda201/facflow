const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const equipmentDao = require("../dao/equipmentDao");

exports.getEquipment = async function () {
  let connection;

  try {
    connection = await pool.getConnection(async (conn) => conn);
  } catch (err) {
    logger.error(`getEquipment DB Connection error\n: ${JSON.stringify(err)}`);
    throw err;
  }

  try {
    const summary = await equipmentDao.selectEquipmentSummary(connection);
    const equipments = await equipmentDao.selectEquipmentList(connection);
        
    return {
      summary: summary[0],
      equipments,
    };

  } catch (err) {
    logger.error(`getEquipment DB Query error\n: ${JSON.stringify(err)}`);
    throw err;

  } finally {
    connection.release();
  }
};


exports.getIdleEquipment = async function () {
    let connection;

    try {
        connection = await pool.getConnection(async (conn) => conn);
    } catch (err) {
        logger.error(`getEquipment DB Connection error\n: ${JSON.stringify(err)}`);
        throw err;
    }

    try {
        const equipments = await equipmentDao.selectIdleEquipment(connection);
        return equipments;
    }
    catch (err) {
        logger.error(`getIdleEquipment DB Query error\n: ${JSON.stringify(err)}`);
        throw err;
    }
    finally {
        connection.release();
    }
};