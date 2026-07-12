const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const dashboardDao = require("../dao/dashboardDao");

exports.getDashboard = async function () {
  let connection;

  try {
    connection = await pool.getConnection(async (conn) => conn);

  } catch (err) {
    logger.error(`getDashboard DB Connection error\n: ${JSON.stringify(err)}`);
    
    throw err;
  }

  try {

    const todayProduction =
        await dashboardDao.selectTodayProduction(connection);

    const achievementRate =
        await dashboardDao.selectAchievementRate(connection);

    const todayDefect =
        await dashboardDao.selectTodayDefect(connection);

    const todayDefectRate =
        await dashboardDao.selectTodayDefectRate(connection);

    const equipmentUtilization =
        await dashboardDao.selectEquipmentUtilization(connection);

    const productChart =
        await dashboardDao.selectProductChart(connection);

    const weeklyChart =
        await dashboardDao.selectWeeklyChart(connection);

        
    return {
        todayProduction,
        achievementRate,
        todayDefect,
        todayDefectRate,
        equipmentUtilization,
        productChart,
        weeklyChart
    };

  } catch (err) {
    logger.error(`getDashboard Query error\n: ${JSON.stringify(err)}`);
    throw err;

  } finally {
    connection.release();
  }
};