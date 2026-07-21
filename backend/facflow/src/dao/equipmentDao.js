const { today } = require("../utils/date");

exports.selectEquipmentSummary = async function (connection) {
  const Query = 
    `SELECT 
      COUNT(*) AS totalEquipment,
      COUNT(CASE WHEN status = 'RUN' THEN 1 END) AS runningEquipment,
      COUNT(CASE WHEN status = 'IDLE' THEN 1 END) AS idleEquipment,
      COUNT(CASE WHEN status = 'STOP' THEN 1 END) AS stoppedEquipment
    FROM Equipment;`;
  const Params = [];

  const [rows] = await connection.query(Query, Params);
  return rows;
};

exports.selectEquipmentList = async function (connection) {
  const Query = 
    `SELECT 
      equipmentId,
      equipmentName,
      status,
      createdAt
    FROM Equipment
    ORDER BY createdAt DESC;`;
  const Params = [];

  const [rows] = await connection.query(Query, Params);
  return rows;
};

exports.selectIdleEquipment = async function (connection, productId) {
  const Query = 
    `SELECT 
      e.equipmentId,
      e.equipmentName,
      e.status,
      e.createdAt
    FROM Equipment e
    INNER JOIN EquipmentProduct epp ON e.equipmentId = epp.equipmentId
    WHERE e.status = 'IDLE'
      AND epp.productId = ?
    ORDER BY e.equipmentId ASC;`;
  const Params = [productId];
  const [rows] = await connection.query(Query, Params);
  return rows;
};

exports.selectEquipmentById = async function (connection, equipmentId) {
  const Query =
    `SELECT equipmentId, equipmentName, status
    FROM Equipment
    WHERE equipmentId = ?;`;
  const Params = [equipmentId];

  const [rows] = await connection.query(Query, Params);
  return rows[0];
};

exports.updateEquipmentStatus = async function (connection, equipmentId, status) {
  const Query = `UPDATE Equipment SET status = ? WHERE equipmentId = ?;`;
  const Params = [status, equipmentId];

  const [result] = await connection.query(Query, Params);
  return result;
};    


// productionQty(한달간 생산 총량), defectQty(한달간 불량 총량), defectRate(한달간 불량률)
exports.getEquipmentDetail = async function (connection, equipmentId) {
  const Query = `
    SELECT
      IFNULL(SUM(IFNULL(p.goodQty, 0) + IFNULL(p.defectQty, 0)), 0) AS productionQty,
      IFNULL(SUM(IFNULL(p.defectQty, 0)), 0) AS defectQty,
      IFNULL(
        SUM(IFNULL(p.defectQty, 0)) / NULLIF(SUM(IFNULL(p.goodQty, 0) + IFNULL(p.defectQty, 0)), 0) * 100,
        0
      ) AS defectRate
    FROM Production p
    WHERE p.equipmentId = ?
      AND p.endTime IS NOT NULL
      AND p.startTime >= DATE_SUB(?, INTERVAL 29 DAY)
      AND p.startTime < DATE_ADD(?, INTERVAL 1 DAY);`;
  const Params = [equipmentId, today(), today()];

  const [rows] = await connection.query(Query, Params);
  return rows[0];
};

exports.selectEquipmentProducts = async function (connection, equipmentId) {
  const Query = `
    SELECT
      p.productId,
      p.productCode,
      p.productName,
      epp.hourlyCapacity
    FROM EquipmentProduct epp
    INNER JOIN Product p ON p.productId = epp.productId
    WHERE epp.equipmentId = ?
    ORDER BY p.productCode ASC;`;
  const Params = [equipmentId];

  const [rows] = await connection.query(Query, Params);
  return rows;
};