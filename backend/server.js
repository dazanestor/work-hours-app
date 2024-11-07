const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Configuración de la base de datos
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432, // Puerto de PostgreSQL
});

pool.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos PostgreSQL');
  }
});

// Función para crear un usuario administrador predeterminado
const createDefaultAdmin = async () => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE rol = 'admin'");
    if (result.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await pool.query(
        "INSERT INTO users (nombre, apellido, correo, password, rol) VALUES ($1, $2, $3, $4, $5)",
        ['Admin', 'User', 'admin@example.com', hashedPassword, 'admin']
      );
      console.log("Usuario administrador predeterminado creado con correo 'admin@example.com' y contraseña 'admin'");
    } else {
      console.log("Usuario administrador ya existe. No se creó un nuevo usuario.");
    }
  } catch (error) {
    console.error("Error creando el usuario administrador predeterminado:", error.message);
  }
};

// Llamada a la función para crear el administrador
createDefaultAdmin();

// Configuración de Redis (opcional)
const redis = require('redis');
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on('error', (err) => {
  console.error('Error conectando a Redis:', err);
});

// Middleware
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  logger.info(`Request to ${req.url} - ${req.method}`);
  next();
});

// Importar y usar las rutas
app.use('/users', require('./routes/userRoutes'));
app.use('/work-hours', require('./routes/workHoursRoutes'));

// Ruta de prueba para verificar la conexión a PostgreSQL
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Conexión exitosa a la base de datos', time: result.rows[0] });
  } catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: 'Error en la conexión a la base de datos' });
  }
});

// Iniciar el servidor
app.listen(port, () => console.log(`Backend corriendo en el puerto ${port}`));
