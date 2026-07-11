const { pool } = require("../../config/database");

exports.exampleDao = async function (connection) {
  const Query = `SELECT * FROM Product;`;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};
