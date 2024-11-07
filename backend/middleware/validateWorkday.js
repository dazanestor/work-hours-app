const redisClient = require('../config/redis');
const pool = require('../config/db');

const isHoliday = async (date) => {
  const cachedHolidays = await redisClient.get('holidays');
  if (cachedHolidays) {
    const holidays = JSON.parse(cachedHolidays);
    return holidays.some(holiday => holiday.date === date);
  } else {
    const result = await pool.query('SELECT * FROM holidays');
    redisClient.set('holidays', JSON.stringify(result.rows), 'EX', 86400);
    return result.rows.some(holiday => holiday.date === date);
  }
};

const validateWorkday = async (req, res, next) => {
  const { date } = req.body;
  const dayOfWeek = new Date(date).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isHolidayToday = await isHoliday(date);
  if (isWeekend || isHolidayToday) {
    return res.status(400).json({ error: "No se pueden registrar horas en días no laborables." });
  }
  next();
};

module.exports = validateWorkday;
