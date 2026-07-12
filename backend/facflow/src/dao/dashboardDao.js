const { pool } = require("../../config/database");

// - selectTodayProduction() : 오늘자 생산량 총합
// - selectAchievementRate() : 달성률(오늘자 생산량 / 오늘자 목표량)
// - selectTodayDefect() : 오늘자 불량량 총합
// - selectTodayDefectRate() : 오늘자 불량률(오늘자 불량량 / 오늘자 생산량)
// - selectEquipmentUtilization() : 장비 사용률
// - selectProductChart() : 주간 제품별 생산량 차트
// - selectWeeklyChart() : 주간 날짜별 생산량 추이 차트

const DATE_SUB = `DATE_SUB(CURDATE(), INTERVAL 1 DAY)`; // 어제 날짜

exports.selectTodayProduction = async function (connection) {
  const Query = 
    `SELECT IFNULL(SUM(p.goodQty), 0) AS todayProduction 
    FROM Production p
    INNER JOIN ProductPlan pp ON p.planId = pp.planId
    WHERE pp.planDate = ${DATE_SUB};`;
  const Params = [];

  const [rows] = await connection.query(Query, Params);
  console.log(rows[0].todayProduction);

  return rows[0].todayProduction;
};

exports.selectAchievementRate = async function (connection) {
  const Query = 
    `SELECT 
      IFNULL(
        SUM(p.goodQty) / NULLIF(SUM(pp.targetQty),0) * 100,
        0
      ) AS achievementRate
    FROM Production p
    INNER JOIN ProductPlan pp 
    ON p.planId = pp.planId
    WHERE pp.planDate = ${DATE_SUB};`;

  const Params = [];

  const [rows] = await connection.query(Query, Params);
  return rows[0].achievementRate;

};

exports.selectTodayDefect = async function (connection) {
  const Query = 
    `SELECT IFNULL(SUM(p.defectQty), 0) AS todayDefect 
    FROM Production p
    INNER JOIN ProductPlan pp ON p.planId = pp.planId
    WHERE pp.planDate = ${DATE_SUB};`;
  const Params = [];

  const [rows] = await connection.query(Query, Params);

  return rows[0].todayDefect;
};

exports.selectTodayDefectRate = async function (connection) {
  const Query = 
    `SELECT IFNULL(SUM(p.defectQty) / NULLIF(SUM(p.goodQty),0) * 100, 0) AS todayDefectRate 
    FROM Production p
    INNER JOIN ProductPlan pp ON p.planId = pp.planId
    WHERE pp.planDate = ${DATE_SUB};`;
  const Params = [];

  const [rows] = await connection.query(Query, Params);
  return rows[0].todayDefectRate;
};

exports.selectEquipmentUtilization = async function (connection) {
  const Query = 
    `SELECT 
      IFNULL(
        SUM(CASE WHEN status = 'RUNNING' THEN 1 ELSE 0 END) 
        / NULLIF(COUNT(*), 0) * 100,
        0
      ) AS equipmentUtilization
    FROM Equipment;`;

  const Params = [];

  const [rows] = await connection.query(Query, Params);

  return rows[0].equipmentUtilization;
};

exports.selectProductChart = async function (connection) {
  const Query = 
    `SELECT 
      prod.productId,
      prod.productName,
      SUM(pr.goodQty) AS productionQty
    FROM Production pr
    INNER JOIN ProductPlan pp ON pr.planId = pp.planId
    INNER JOIN Product prod ON pp.productId = prod.productId
    WHERE pp.planDate BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()
    GROUP BY prod.productId, prod.productName
    ORDER BY productionQty DESC
    LIMIT 5;`;

  const Params = [];

  const [rows] = await connection.query(Query, Params);

  return rows;
};

exports.selectWeeklyChart = async function (connection) {
  const Query = 
    `SELECT 
      pp.planDate AS date,
      SUM(p.goodQty) AS productionQty
    FROM Production p
    INNER JOIN ProductPlan pp ON p.planId = pp.planId
    WHERE pp.planDate BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()
    GROUP BY pp.planDate
    ORDER BY pp.planDate;`;

  const Params = [];

  const [rows] = await connection.query(Query, Params);

  return rows;
};