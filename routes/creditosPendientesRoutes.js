const express = require('express');
const router = express.Router();
const creditosPendientesController = require('../controllers/creditosPendientesController');

// Ruta para obtener todos los créditos pendientes
router.get('/creditos-pendientes', creditosPendientesController.obtenerCreditosPendientes);

// Ruta para contar cuentas pendientes
router.get('/creditos-pendientes/contar/:mes', creditosPendientesController.contarCuentasPendientes);

// Ruta dinámica para obtener créditos según el mes (0, 1 o 2)
router.get('/creditos-pendientes/:mes', creditosPendientesController.obtenerCreditosPorMes);

module.exports = router;
