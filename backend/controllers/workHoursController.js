const pool = require('../config/db');

const registerWorkHours = async (req, res) => {
  const { userId, projectId, date, hours, task } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO work_hours (user_id, project_id, date, hours, task) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, projectId, date, hours, task]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWorkHours = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      'SELECT * FROM work_hours ORDER BY date DESC LIMIT $1 OFFSET $2',
      [parseInt(limit), parseInt(offset)]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerWorkHours, getWorkHours };
