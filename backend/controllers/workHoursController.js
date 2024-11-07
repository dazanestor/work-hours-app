const pool = require('../config/db');

// Registrar horas de trabajo
const registerWorkHours = async (req, res) => {
  const { projectId, date, hours, task } = req.body;
  const userId = req.user.id;  // El usuario autenticado
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

// Ver el historial de horas completo (solo admin)
const getAllWorkHours = async (req, res) => {
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

// Ver el propio historial de horas
const getOwnWorkHours = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      'SELECT * FROM work_hours WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar horas de trabajo (solo admin)
const editWorkHours = async (req, res) => {
  const { id } = req.params;
  const { projectId, date, hours, task } = req.body;
  try {
    const result = await pool.query(
      'UPDATE work_hours SET project_id = $1, date = $2, hours = $3, task = $4 WHERE id = $5 RETURNING *',
      [projectId, date, hours, task, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar horas de trabajo (solo admin)
const deleteWorkHours = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM work_hours WHERE id = $1', [id]);
    res.status(200).json({ message: "Registro eliminado con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerWorkHours, getAllWorkHours, getOwnWorkHours, editWorkHours, deleteWorkHours };
