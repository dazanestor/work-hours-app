const { Pool } = require('pg');
const pool = new Pool();

const findUserByEmail = async (email) => {
  const user = await pool.query('SELECT * FROM users WHERE correo = $1', [email]);
  return user.rows[0];
};

const createUser = async (nombre, apellido, correo, hashedPassword, rol) => {
  const result = await pool.query(
    'INSERT INTO users (nombre, apellido, correo, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nombre, apellido, correo, hashedPassword, rol]
  );
  return result.rows[0];
};

module.exports = { findUserByEmail, createUser };
