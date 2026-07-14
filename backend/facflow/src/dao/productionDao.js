const { pool } = require("../../config/database");

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
            pp.status
        FROM Production p
        INNER JOIN ProductPlan pp ON p.planId = pp.planId
        INNER JOIN Product prod ON pp.productId = prod.productId
        INNER JOIN Equipment eq ON p.equipmentId = eq.equipmentId
        WHERE pp.planDate = ?
        AND (pp.status = 'DONE' OR pp.status = 'RUN')
        ORDER BY p.startTime DESC;`;
    const Params = [productionDate];

    const [rows] = await connection.query(Query, Params);
    return rows;
};


exports.insertProduction = async function (connection, planId, equipmentId) {
    const Query = 
        `
        INSERT INTO Production (planId, equipmentId, startTime)
        SELECT ?, ?, NOW()
        WHERE NOT EXISTS (
            SELECT 1
            FROM Production
            WHERE planId = ?
        );
        `;
    const Params = [planId, equipmentId, planId];

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
        SET endTime = NOW(), goodQty = ?, defectQty = ? 
        WHERE productionId = ?;`;
    const Params = [goodQty, defectQty, productionId];

    const [result] = await connection.query(Query, Params);
    return result;
};