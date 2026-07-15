const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const equipmentDao = require("../dao/equipmentDao");

const EMPTY_EQUIPMENT_STATS = {
  productionQty: 0,
  defectQty: 0,
  defectRate: 0,
};

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

// 생산중인 설비가 멈출 경우 이후 로직 구현 필요
exports.updateEquipmentStatus = async function (equipmentId, status) {
  let connection;

  try {
    connection = await pool.getConnection(async (conn) => conn);
  } catch (err) {
    logger.error(`updateEquipmentStatus DB Connection error\n: ${JSON.stringify(err)}`);
    throw err;
  }

  try {
    const result = await equipmentDao.updateEquipmentStatus(connection, equipmentId, status);
    return result;
  } catch (err) {
    logger.error(`updateEquipmentStatus DB Query error\n: ${JSON.stringify(err)}`);
    throw err;
  }
  finally {
    connection.release();
  }
};

exports.getEquipmentDetail = async function (equipmentId) {
  let connection;

  try {
    connection = await pool.getConnection(async (conn) => conn);
  } catch (err) {
    logger.error(`getEquipmentDetail DB Connection error\n: ${JSON.stringify(err)}`);
    throw err;
  }

  try {
    const result = await equipmentDao.getEquipmentDetail(connection, equipmentId);
    return result ?? EMPTY_EQUIPMENT_STATS;
  } catch (err) {
    logger.error(`getEquipmentDetail DB Query error\n: ${JSON.stringify(err)}`);
    throw err;
  }
  finally {
    connection.release();
  }
};