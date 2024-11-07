const express = require('express');
const { registerWorkHours, getAllWorkHours, getOwnWorkHours, editWorkHours, deleteWorkHours } = require('../controllers/workHoursController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authenticateToken, registerWorkHours);               // Registrar horas (usuario autenticado)
router.get('/own', authenticateToken, getOwnWorkHours);                       // Ver propio historial (usuario autenticado)
router.get('/all', authenticateToken, requireAdmin, getAllWorkHours);         // Ver historial completo (solo admin)
router.put('/:id', authenticateToken, requireAdmin, editWorkHours);           // Editar horas (solo admin)
router.delete('/:id', authenticateToken, requireAdmin, deleteWorkHours);      // Eliminar horas (solo admin)

module.exports = router;
