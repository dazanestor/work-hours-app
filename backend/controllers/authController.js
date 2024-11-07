const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const registerUser = async (req, res) => {
  const { nombre, apellido, correo, password, rol } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (nombre, apellido, correo, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, apellido, correo, hashedPassword, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { correo, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE correo = $1', [correo]);
  if (user.rows.length === 0) return res.status(400).json({ error: "Usuario no encontrado" });

  const validPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!validPassword) return res.status(400).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 });
  res.status(200).json({ message: "Inicio de sesión exitoso" });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (user.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const validPassword = await bcrypt.compare(currentPassword, user.rows[0].password);
    if (!validPassword) return res.status(400).json({ error: "Contraseña actual es incorrecta" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, req.user.id]);

    res.status(200).json({ message: "Contraseña actualizada con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser, changePassword };
