const express = require('express');
const router = express.Router();
const agenciaController = require('../controllers/analisisConteoParcialController');
const verifyToken = require('../middlewares/authMiddleware.js');

// Ruta para obtener los datos de una agencia en un rango de fechas
router.get('/datos-fechas-fijas/:agencia', verifyToken, agenciaController.obtenerDatosFechasFijas);
router.get('/analisis-estado-cero', verifyToken, agenciaController.obtenerAnalisiEstadoCero);
router.get('/analisis-estado-uno', verifyToken, agenciaController.obtenerAnalisiEstadoUno);
router.get('/conteo-analisis/:estado/:agencia', verifyToken, agenciaController.obtenerAnalisisFechasFijas);
router.get('/conteo-total/:estado', verifyToken, agenciaController.obtenerAnalisisConteoTotales);

module.exports = router;
