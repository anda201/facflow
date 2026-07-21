const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const equipmentDao = require("../dao/equipmentDao");
const planDao = require("../dao/planDao");
const productionDao = require("../dao/productionDao");
const { generateHaltedProductionQty } = require("../utils/productionQtyGenerator");

const EMPTY_EQUIPMENT_DETAIL = {
  productionQty: 0,
  defectQty: 0,
  defectRate: 0,
  products: [],
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


exports.getIdleEquipment = async function (productId) {
    let connection;

    try {
        connection = await pool.getConnection(async (conn) => conn);
    } catch (err) {
        logger.error(`getEquipment DB Connection error\n: ${JSON.stringify(err)}`);
        throw err;
    }

    try {
        const equipments = await equipmentDao.selectIdleEquipment(connection, productId);
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

exports.updateEquipmentStatus = async function (equipmentId, status) {
  let connection;

  try {
    connection = await pool.getConnection(async (conn) => conn);
  } catch (err) {
    logger.error(`updateEquipmentStatus DB Connection error\n: ${JSON.stringify(err)}`);
    throw err;
  }

  try {
    const equipment = await equipmentDao.selectEquipmentById(connection, equipmentId);
    if (!equipment) {
      const err = new Error("EQUIPMENT_NOT_FOUND");
      err.statusCode = 404;
      throw err;
    }

    const previousStatus = equipment.status;
    let haltedPlan = null;

    if (status === "STOP" && previousStatus === "RUN") {
      await connection.beginTransaction();

      const running = await productionDao.selectRunningProductionByEquipmentId(
        connection,
        equipmentId
      );

      if (running) {
        const { goodQty, defectQty, producedQty } = generateHaltedProductionQty(
          running.targetQty
        );

        await productionDao.endProduction(
          connection,
          running.productionId,
          goodQty,
          defectQty
        );
        await planDao.updatePlanStatus(connection, running.planId, "HALT");

        haltedPlan = {
          planId: running.planId,
          targetQty: running.targetQty,
          producedQty,
          goodQty,
          defectQty,
          remainingQty: Math.max(0, running.targetQty - producedQty),
        };
      }

      await equipmentDao.updateEquipmentStatus(connection, equipmentId, status);
      await connection.commit();
    } else {
      await equipmentDao.updateEquipmentStatus(connection, equipmentId, status);
    }

    return {
      equipmentId: Number(equipmentId),
      previousStatus,
      status,
      haltedPlan,
    };
  } catch (err) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (_) {
        /* ignore rollback error */
      }
    }
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
    const [stats, products] = await Promise.all([
      equipmentDao.getEquipmentDetail(connection, equipmentId),
      equipmentDao.selectEquipmentProducts(connection, equipmentId),
    ]);

    return {
      ...(stats ?? EMPTY_EQUIPMENT_DETAIL),
      products,
    };
  } catch (err) {
    logger.error(`getEquipmentDetail DB Query error\n: ${JSON.stringify(err)}`);
    throw err;
  }
  finally {
    connection.release();
  }
};
