module.exports = function (app) {
  const product = require("../controllers/productController");

  app.get("/product", product.getProducts);
};
