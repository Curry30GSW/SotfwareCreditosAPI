const express = require('express');
const router = express.Router();
const creditosPendientesController = require('../controllers/creditosPendientesController');
const verifyToken = require('../middlewares/authMiddleware.js');

// Ruta para obtener todos los créditos pendientes
router.get('/creditos-pendientes', verifyToken, creditosPendientesController.obtenerCreditosPendientes);

// Ruta para contar cuentas pendientes
router.get('/creditos-pendientes/contar/:mes', verifyToken, creditosPendientesController.contarCuentasPendientes);

// Ruta dinámica para obtener créditos según el mes (0, 1 o 2)
router.get('/creditos-pendientes/:mes', verifyToken, creditosPendientesController.obtenerCreditosPorMes);

module.exports = router;
