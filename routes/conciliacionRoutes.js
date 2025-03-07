const express = require('express');
const router = express.Router();
const { getPrimerUltimoCreditoMes } = require('../controllers/conciliacionController');
const verifyToken = require('../middlewares/authMiddleware.js');

// Ruta para obtener el primer crédito del mes
router.get('/conciliacion/primer-credito', verifyToken, getPrimerUltimoCreditoMes);

module.exports = router;
