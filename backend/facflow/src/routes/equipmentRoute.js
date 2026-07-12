module.exports = function (app) {
    const equipment = require("../controllers/equipmentController");
  
    app.get("/equipment", equipment.getEquipment);
    app.get("/idle-equipment", equipment.getIdleEquipment);
  };