const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const dashboardDao = require("../dao/dashboardDao");
const { today } = require("../utils/date");

exports.getDashboard = async function () {
  let connection;

  try {
    connection = await pool.getConnection(async (conn) => conn);

  } catch (err) {
    logger.error(`getDashboard DB Connection error\n: ${JSON.stringify(err)}`);
    
    throw err;
  }

  try {
    const date = today();

    const todayProduction =
        await dashboardDao.selectTodayProduction(connection, date);

    const achievementRate =
        await dashboardDao.selectAchievementRate(connection, date);

    const todayDefect =
        await dashboardDao.selectTodayDefect(connection, date);

    const todayDefectRate =
        await dashboardDao.selectTodayDefectRate(connection, date);

    const equipmentUtilization =
        await dashboardDao.selectEquipmentUtilization(connection);

    const productChart =
        await dashboardDao.selectProductChart(connection, date);

    const weeklyChart =
        await dashboardDao.selectWeeklyChart(connection, date);

        
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