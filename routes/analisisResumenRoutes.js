const express = require('express');
const router = express.Router();
const analisisResumenController = require('../controllers/analisisResumenController');

router.get('/analisis/:estado/:mes', analisisResumenController.obtenerAnalisis);
router.get('/analisis/:estado/:mes/:agencia', analisisResumenController.obtenerDatosPorAgencia);

module.exports = router;
