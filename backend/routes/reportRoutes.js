const express = require('express');
const { generateReport } = require('../controllers/reportController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/export', authenticateToken, requireAdmin, generateReport);  // Exportar reportes (solo admin)

module.exports = router;
