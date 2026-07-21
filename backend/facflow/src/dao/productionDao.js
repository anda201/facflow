const { pool } = require("../../config/database");
const { now, today } = require("../utils/date");

// - selectProductionSummary() : 생산 실적 현황 요약 데이터
// - selectProductionList() : 생산 실적 목록 데이터

exports.selectProductionSummary = async function (connection, productionDate) {
    const Query = 
    `SELECT 
        COUNT(*) AS totalProductions,
        IFNULL(SUM(p.goodQty), 0) AS totalGoodQty,
        IFNULL(SUM(p.defectQty), 0) AS totalDefectQty,
        IFNULL(SUM(p.goodQty + p.defectQty), 0) AS totalProductionQty,
        IFNULL(SUM(p.defectQty) / NULLIF(SUM(p.goodQty + p.defectQty), 0) * 100, 0) AS defectRate
    FROM Production p
    INNER JOIN ProductPlan pp ON p.planId = pp.planId
    WHERE pp.planDate = ?
    AND pp.status = 'DONE';`;
    const Params = [productionDate];

    const [rows] = await connection.query(Query, Params);
    return rows;
};


exports.selectProductionList = async function (connection, productionDate) {
    const Query = 
        `SELECT 
            p.productionId,
            pp.productId,
            prod.productName,
            p.equipmentId,
            eq.equipmentName,
            p.startTime,
            p.endTime,
            p.goodQty,
            p.defectQty,
            pp.status,
            pp.targetQty,
            GREATEST(
              pp.targetQty - IFNULL(p.goodQty, 0) - IFNULL(p.defectQty, 0),
              0
            ) AS remainingQty
        FROM Production p
        INNER JOIN ProductPlan pp ON p.planId = pp.planId
        INNER JOIN Product prod ON pp.productId = prod.productId
        INNER JOIN Equipment eq ON p.equipmentId = eq.equipmentId
        WHERE pp.planDate = ?
        AND pp.status IN ('DONE', 'RUN', 'HALT')
        ORDER BY p.startTime DESC;`;
    const Params = [productionDate];

    const [rows] = await connection.query(Query, Params);
    return rows;
};

exports.selectOverdueProductionList = async function (connection) {
    const Query =
        `SELECT
            p.productionId,
            pp.productId,
            pp.planDate,
            pp.dueDate,
            prod.productName,
            p.equipmentId,
            eq.equipmentName,
            p.startTime,
            p.endTime,
            p.goodQty,
            p.defectQty,
            pp.status,
            pp.targetQty,
            GREATEST(
              pp.targetQty - IFNULL(p.goodQty, 0) - IFNULL(p.defectQty, 0),
              0
            ) AS remainingQty
        FROM Production p
        INNER JOIN ProductPlan pp ON p.planId = pp.planId
        INNER JOIN Product prod ON pp.productId = prod.productId
        INNER JOIN Equipment eq ON p.equipmentId = eq.equipmentId
        WHERE pp.planDate < ?
          AND pp.status = 'RUN'
        ORDER BY pp.planDate ASC, p.startTime DESC;`;
    const Params = [today()];

    const [rows] = await connection.query(Query, Params);
    return rows;
};


exports.selectRunningProductionByEquipmentId = async function (connection, equipmentId) {
    const Query =
        `SELECT
            p.productionId,
            p.planId,
            pp.targetQty,
            pp.status AS planStatus
        FROM Production p
        INNER JOIN ProductPlan pp ON p.planId = pp.planId
        WHERE p.equipmentId = ?
          AND pp.status = 'RUN'
          AND p.endTime IS NULL
        LIMIT 1;`;
    const Params = [equipmentId];

    const [rows] = await connection.query(Query, Params);
    return rows[0];
};

exports.selectProductionByPlanId = async function (connection, planId) {
    const Query =
        `SELECT productionId, planId, equipmentId
        FROM Production
        WHERE planId = ?;`;
    const Params = [planId];

    const [rows] = await connection.query(Query, Params);
    return rows[0];
};

exports.updateProductionEquipment = async function (connection, planId, equipmentId) {
    const Query =
        `UPDATE Production
        SET equipmentId = ?, startTime = ?
        WHERE planId = ?;`;
    const Params = [equipmentId, now(), planId];

    const [result] = await connection.query(Query, Params);
    return result;
};

exports.insertProduction = async function (connection, planId, equipmentId) {
    const Query = 
        `
        INSERT INTO Production (planId, equipmentId, startTime)
        SELECT ?, ?, ?
        WHERE NOT EXISTS (
            SELECT 1
            FROM Production
            WHERE planId = ?
        );
        `;
    const Params = [planId, equipmentId, now(), planId];

    const [result] = await connection.query(Query, Params);
    return result;
};

exports.selectProductionById = async function (connection, productionId) {
    const Query = 
        `SELECT 
            p.productionId,
            p.planId,
            p.equipmentId,
            pp.targetQty
        FROM Production p
        INNER JOIN ProductPlan pp ON p.planId = pp.planId
        WHERE p.productionId = ?;`;
    const Params = [productionId];

    // console.log(Query, Params);
    const [rows] = await connection.query(Query, Params);
    return rows[0];
};

exports.endProduction = async function (connection, productionId, goodQty, defectQty) {
    const Query = 
        `UPDATE Production 
        SET endTime = ?, goodQty = ?, defectQty = ? 
        WHERE productionId = ?;`;
    const Params = [now(), goodQty, defectQty, productionId];

    const [result] = await connection.query(Query, Params);
    return result;
};