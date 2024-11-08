const express = require('express');
const { registerUser, loginUser, changePassword } = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta protegida solo para administradores
router.post('/register', authenticateToken, requireAdmin, registerUser);
router.post('/login', loginUser);
router.post('/change-password', authenticateToken, changePassword);

module.exports = router;
