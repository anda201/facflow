module.exports = function (app) {
    const production = require("../controllers/productionController");
  
    app.get("/production", production.getProduction);
  };