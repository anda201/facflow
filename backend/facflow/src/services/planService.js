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
    const [summary, plans, overduePlans, haltedPlans] = await Promise.all([
      planDao.selectPlanSummary(connection, date),
      planDao.selectPlanList(connection, date),
      planDao.selectOverduePlanList(connection),
      planDao.selectHaltedPlanList(connection),
    ]);

    return {
      summary: summary[0],
      plans,
      overduePlans,
      haltedPlans,
    };

  } catch (err) {
    logger.error(`getPlan DB Query error\n: ${JSON.stringify(err)}`);
    throw err;

  } finally {
    connection.release();
  }
};


exports.createPlan = async function (productId, planDate, dueDate, targetQty) {
    let connection;
    
    try {
        connection = await pool.getConnection(async (conn) => conn);
    
    } catch (err) {
        logger.error(`createPlan DB Connection error\n: ${JSON.stringify(err)}`);
    
        throw err;
    }

    try {
        const result = await planDao.insertPlan(connection, productId, planDate, dueDate, targetQty);
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

        const existingProduction = await productionDao.selectProductionByPlanId(connection, planId);
        let production;
        if (existingProduction) {
            production = await productionDao.updateProductionEquipment(connection, planId, equipmentId);
        } else {
            production = await productionDao.insertProduction(connection, planId, equipmentId);
        }

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

exports.resumeHaltedPlan = async function (planId, equipmentId) {
    let connection;

    try {
        connection = await pool.getConnection(async (conn) => conn);
    } catch (err) {
        logger.error(`resumeHaltedPlan DB Connection error\n: ${JSON.stringify(err)}`);
        throw err;
    }

    try {
        await connection.beginTransaction();

        const plan = await planDao.selectPlanById(connection, planId);
        if (!plan) {
            const err = new Error("PLAN_NOT_FOUND");
            err.statusCode = 404;
            throw err;
        }
        if (plan.status !== "HALT") {
            const err = new Error("PLAN_NOT_HALT");
            err.statusCode = 400;
            throw err;
        }
        if (!plan.remainingQty || plan.remainingQty <= 0) {
            const err = new Error("NO_REMAINING_QTY");
            err.statusCode = 400;
            throw err;
        }

        const resumePlanDate = today();
        const resumeDueDate =
            plan.dueDate >= resumePlanDate ? plan.dueDate : resumePlanDate;

        const insertResult = await planDao.insertPlan(
            connection,
            plan.productId,
            resumePlanDate,
            resumeDueDate,
            plan.remainingQty
        );
        const newPlanId = insertResult.insertId;

        await planDao.updatePlanStatus(connection, planId, "CANCEL");
        await planDao.updatePlanStatus(connection, newPlanId, "RUN");
        await equipmentDao.updateEquipmentStatus(connection, equipmentId, "RUN");
        await productionDao.insertProduction(connection, newPlanId, equipmentId);

        await connection.commit();

        return {
            oldPlanId: Number(planId),
            newPlanId,
            remainingQty: plan.remainingQty,
            planDate: resumePlanDate,
            dueDate: resumeDueDate,
        };
    } catch (err) {
        await connection.rollback();
        logger.error(`resumeHaltedPlan DB Query error\n: ${JSON.stringify(err)}`);
        throw err;
    } finally {
        connection.release();
    }
};

exports.getAvailableEquipment = async function (planId) {
    let connection;
    try {
        connection = await pool.getConnection(async (conn) => conn);
    } catch (err) {
        logger.error(`getAvailableEquipment DB Connection error\n: ${JSON.stringify(err)}`);
        throw err;
    }

    try {
        const equipments = await planDao.selectIdleEquipmentByPlanId(connection, planId);
        const recommendation = equipments.reduce((best, eq) => {
            if (!best || Number(eq.estimatedHours) < Number(best.estimatedHours)) {
                return eq;
            }
            return best;
        }, null);

        return {
            equipments,
            recommendation: recommendation
                ? {
                    equipmentId: recommendation.equipmentId,
                    estimatedHours: recommendation.estimatedHours,
                }
                : null,
        };
    } catch (err) {
        logger.error(`getAvailableEquipment DB Query error\n: ${JSON.stringify(err)}`);
        throw err;
    } finally {
        connection.release();
    }
};