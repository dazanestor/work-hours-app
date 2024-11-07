
const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const redis = require('redis');
const winston = require('winston');

const app = express();
const port = 5000;

require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.use(express.json());
app.use(cors());

const redisClient = redis.createClient();

redisClient.on('error', (err) => console.error("Redis error:", err));

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: "Acceso denegado" });
  next();
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

app.use((req, res, next) => {
  logger.info(`Request to ${req.url} - ${req.method}`);
  next();
});

app.post('/register', async (req, res) => {
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
});

app.post('/login', async (req, res) => {
  const { correo, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE correo = $1', [correo]);
  if (user.rows.length === 0) return res.status(400).json({ error: "Usuario no encontrado" });

  const validPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!validPassword) return res.status(400).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: user.rows[0].id, role: user.rows[0].rol },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000
  });
  res.status(200).json({ message: "Inicio de sesión exitoso" });
});

app.listen(port, () => console.log(`Backend en puerto ${port}`));
