const express = require('express');
const router = express.Router();
const { getPrimerUltimoCreditoMes } = require('../controllers/conciliacionController');

// Ruta para obtener el primer crédito del mes
router.get('/conciliacion/primer-credito', getPrimerUltimoCreditoMes);

module.exports = router;
