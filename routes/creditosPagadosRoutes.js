const express = require('express');
const router = express.Router();
const { contarPagados, guardarPagado, verCreditosTesoreria, verCreditosTesoreriaTerceros, verpagoApoderados } = require('../controllers/creditosPagadosController');
const verifyToken = require('../middlewares/authMiddleware.js');

router.get('/pagados/creditos', verifyToken, contarPagados);
router.post('/guardar/creditos', verifyToken, guardarPagado);
router.get('/obtener/pagados', verifyToken, verCreditosTesoreria);
router.get('/obtener/pagados-terceros', verifyToken, verCreditosTesoreriaTerceros);
router.get('/obtener/apoderados', verifyToken, verpagoApoderados);

module.exports = router;
