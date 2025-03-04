const express = require('express');
const router = express.Router();
const analisisController = require('../controllers/analisisController');

router.get('/analisis', analisisController.obtenerAnalisis);
router.get('/analisis/ultimo-consecutivo', analisisController.obtenerUltimoConsecutivo);
router.get('/analisis/ultimo-consecutivo/mes-actual', analisisController.obtenerUltimoConsecutivoMesActual);

module.exports = router;
