
exports.selectEquipmentSummary = async function (connection) {
  const Query = 
    `SELECT 
      COUNT(*) AS totalEquipment,
      COUNT(CASE WHEN status = 'RUNNING' THEN 1 END) AS runningEquipment,
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

exports.selectIdleEquipment = async function (connection) {
  const Query = 
    `SELECT 
      equipmentId,
      equipmentName,
      status,
      createdAt
    FROM Equipment
    WHERE status = 'IDLE'
    ORDER BY equipmentId ASC;`;
  const Params = [];
  const [rows] = await connection.query(Query, Params);
  return rows;
};

exports.updateEquipmentStatus = async function (connection, equipmentId, status) {
  const Query = `UPDATE Equipment SET status = ? WHERE equipmentId = ?;`;
  const Params = [status, equipmentId];

  const [result] = await connection.query(Query, Params);
  return result;
};    