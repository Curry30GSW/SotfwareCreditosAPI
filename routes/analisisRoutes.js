const express = require('express');
const router = express.Router();
const analisisController = require('../controllers/analisisController');
const verifyToken = require('../middlewares/authMiddleware.js');

router.get('/analisis', verifyToken, analisisController.obtenerAnalisis);
router.get('/analisis/ultimo-consecutivo', verifyToken, analisisController.obtenerUltimoConsecutivo);
router.get('/analisis/ultimo-consecutivo/mes-actual', verifyToken, analisisController.obtenerUltimoConsecutivoMesActual);
router.get('/analisis/ultimo-consecutivo/:mes', verifyToken, analisisController.obtenerConsecutivosUltimosMeses);


module.exports = router;
