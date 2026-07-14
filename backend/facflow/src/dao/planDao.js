const { pool } = require("../../config/database");

// - selectPlanSummary() : 생산 계획 현황 요약 데이터
// - selectPlanList() : 생산 계획 목록 데이터

exports.selectPlanSummary = async function (connection, planDate) {
    const Query = 
    `SELECT 
        COUNT(*) AS totalPlans,
        COUNT(CASE WHEN status = 'WAIT' THEN 1 END) AS waitPlans,
        COUNT(CASE WHEN status = 'RUN' THEN 1 END) AS runningPlans,
        COUNT(CASE WHEN status = 'DONE' THEN 1 END) AS completedPlans,
        COUNT(CASE WHEN status = 'CANCEL' THEN 1 END) AS canceledPlans
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
            pp.targetQty,
            pp.status,
            pp.createdAt
        FROM ProductPlan pp
        INNER JOIN Product prod ON pp.productId = prod.productId
        WHERE pp.planDate = ?
        ORDER BY pp.createdAt DESC;`;
    const Params = [planDate];

    const [rows] = await connection.query(Query, Params);
    return rows;
};


exports.insertPlan = async function (connection, productId, planDate, targetQty) {
    const Query = 
    `INSERT INTO ProductPlan (productId, planDate, targetQty) VALUES (?, ?, ?);`;
    const Params = [productId, planDate, targetQty];

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
