exports.selectProductList = async function (connection) {
  const Query =
    `SELECT 
      productId,
      productCode,
      productName
    FROM Product
    ORDER BY productId;`;
  const Params = [];

  const [rows] = await connection.query(Query, Params);
  return rows;
};
