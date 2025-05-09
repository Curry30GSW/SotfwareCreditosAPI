const express = require('express');
const router = express.Router();
const { contarPagados, guardarPagado, guardarPagadosLote, verCreditosTesoreria, verCreditosTesoreriaTerceros, verpagoApoderados, getCreditosPorCedula,registrarAuditoriaModulo } = require('../controllers/creditosPagadosController');
const verifyToken = require('../middlewares/authMiddleware.js');

router.get('/pagados/creditos', verifyToken, contarPagados);
router.post('/guardar/creditos', verifyToken, guardarPagado);
router.post('/guardar/creditos-lote', verifyToken, guardarPagadosLote);
router.get('/obtener/pagados', verifyToken, verCreditosTesoreria);
router.get('/obtener/pagados-terceros', verifyToken, verCreditosTesoreriaTerceros);
router.get('/obtener/apoderados', verifyToken, verpagoApoderados);
router.get('/creditos/:cedula', getCreditosPorCedula);
router.post('/auditoria/moduloPT', verifyToken, registrarAuditoriaModulo);

module.exports = router;
