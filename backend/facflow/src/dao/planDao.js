const { pool } = require("../../config/database");
const { today } = require("../utils/date");

// - selectPlanSummary() : 생산 계획 현황 요약 데이터
// - selectPlanList() : 생산 계획 목록 데이터

exports.selectPlanSummary = async function (connection, planDate) {
    const Query = 
    `SELECT 
        COUNT(*) AS totalPlans,
        COUNT(CASE WHEN status = 'WAIT' THEN 1 END) AS waitPlans,
        COUNT(CASE WHEN status = 'RUN' THEN 1 END) AS runningPlans,
        COUNT(CASE WHEN status = 'DONE' THEN 1 END) AS completedPlans,
        COUNT(CASE WHEN status = 'CANCEL' THEN 1 END) AS canceledPlans,
        COUNT(CASE WHEN status = 'HALT' THEN 1 END) AS haltedPlans
    FROM ProductPlan
    WHERE planDate = ?;`;
    const Params = [planDate];

    const [rows] = await connection.query(Query, Params);
    return rows;
};

exports.selectPlanList = async function (connection, planDate) {
    const Query = 
        `SELECT 
            pp.planId,
            pp.productId,
            prod.productCode,
            prod.productName,
            pp.planDate,
            pp.dueDate,
            pp.targetQty,
            pp.status,
            pp.createdAt,
            IFNULL(pr.goodQty, 0) AS goodQty,
            IFNULL(pr.defectQty, 0) AS defectQty,
            GREATEST(
              pp.targetQty - IFNULL(pr.goodQty, 0) - IFNULL(pr.defectQty, 0),
              0
            ) AS remainingQty
        FROM ProductPlan pp
        INNER JOIN Product prod ON pp.productId = prod.productId
        LEFT JOIN Production pr ON pr.planId = pp.planId
        WHERE pp.planDate = ?
        ORDER BY pp.createdAt DESC;`;
    const Params = [planDate];

    const [rows] = await connection.query(Query, Params);
    return rows;
};

exports.selectOverduePlanList = async function (connection) {
    const Query =
        `SELECT
            pp.planId,
            pp.productId,
            prod.productCode,
            prod.productName,
            pp.planDate,
            pp.dueDate,
            pp.targetQty,
            pp.status,
            pp.createdAt,
            IFNULL(pr.goodQty, 0) AS goodQty,
            IFNULL(pr.defectQty, 0) AS defectQty,
            GREATEST(
              pp.targetQty - IFNULL(pr.goodQty, 0) - IFNULL(pr.defectQty, 0),
              0
            ) AS remainingQty
        FROM ProductPlan pp
        INNER JOIN Product prod ON pp.productId = prod.productId
        LEFT JOIN Production pr ON pr.planId = pp.planId
        WHERE pp.planDate < ?
          AND pp.status IN ('WAIT', 'RUN')
        ORDER BY pp.planDate ASC, pp.createdAt DESC;`;
    const Params = [today()];

    const [rows] = await connection.query(Query, Params);
    return rows;
};

exports.selectHaltedPlanList = async function (connection) {
    const Query =
        `SELECT
            pp.planId,
            pp.productId,
            prod.productCode,
            prod.productName,
            pp.planDate,
            pp.dueDate,
            pp.targetQty,
            pp.status,
            pp.createdAt,
            IFNULL(pr.goodQty, 0) AS goodQty,
            IFNULL(pr.defectQty, 0) AS defectQty,
            GREATEST(
              pp.targetQty - IFNULL(pr.goodQty, 0) - IFNULL(pr.defectQty, 0),
              0
            ) AS remainingQty
        FROM ProductPlan pp
        INNER JOIN Product prod ON pp.productId = prod.productId
        LEFT JOIN Production pr ON pr.planId = pp.planId
        WHERE pp.status = 'HALT'
        ORDER BY pp.planDate ASC, pp.createdAt DESC;`;

    const [rows] = await connection.query(Query);
    return rows;
};


exports.insertPlan = async function (connection, productId, planDate, dueDate, targetQty) {
    const Query = 
    `INSERT INTO ProductPlan (productId, planDate, dueDate, targetQty) VALUES (?, ?, ?, ?);`;
    const Params = [productId, planDate, dueDate, targetQty];

    const [result] = await connection.query(Query, Params);
    return result;
};


exports.updatePlanStatus = async function (connection, planId, status) {
    const Query = 
    `UPDATE ProductPlan SET status = ? WHERE planId = ?;`;
    const Params = [status, planId];

    const [result] = await connection.query(Query, Params);
    return result;
};

exports.selectPlanById = async function (connection, planId) {
    const Query =
        `SELECT
            pp.planId,
            pp.productId,
            prod.productCode,
            prod.productName,
            pp.planDate,
            pp.dueDate,
            pp.targetQty,
            pp.status,
            pp.createdAt,
            IFNULL(pr.goodQty, 0) AS goodQty,
            IFNULL(pr.defectQty, 0) AS defectQty,
            GREATEST(
              pp.targetQty - IFNULL(pr.goodQty, 0) - IFNULL(pr.defectQty, 0),
              0
            ) AS remainingQty
        FROM ProductPlan pp
        INNER JOIN Product prod ON pp.productId = prod.productId
        LEFT JOIN Production pr ON pr.planId = pp.planId
        WHERE pp.planId = ?;`;
    const Params = [planId];

    const [rows] = await connection.query(Query, Params);
    return rows[0];
};


exports.selectIdleEquipmentByPlanId = async function (connection, planId) {
    const Query =
        `SELECT
            e.equipmentId,
            e.equipmentName,
            e.status,
            e.createdAt,
            IFNULL(p.targetQty / epp.hourlyCapacity, 0) AS estimatedHours
        FROM Equipment e
        INNER JOIN EquipmentProduct epp ON e.equipmentId = epp.equipmentId
        INNER JOIN ProductPlan p ON p.productId = epp.productId
        WHERE p.planId = ?
          AND e.status = 'IDLE'
        ORDER BY e.equipmentId ASC;`;
    const Params = [planId];

    const [rows] = await connection.query(Query, Params);
    return rows;
};

