const express = require('express');
const { registerWorkHours, getWorkHours } = require('../controllers/workHoursController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const validateWorkday = require('../middleware/validateWorkday');

const router = express.Router();

router.post('/', authenticateToken, validateWorkday, registerWorkHours);
router.get('/', authenticateToken, requireAdmin, getWorkHours);

module.exports = router;
