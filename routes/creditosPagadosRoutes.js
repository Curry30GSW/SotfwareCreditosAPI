const express = require('express');
const router = express.Router();
const { contarPagados, guardarPagado, verCreditosTesoreria } = require('../controllers/creditosPagadosController');
const verifyToken = require('../middlewares/authMiddleware.js');

router.get('/pagados/creditos', verifyToken, contarPagados);
router.post('/guardar/creditos', verifyToken, guardarPagado);
router.get('/obtener/pagados', verifyToken, verCreditosTesoreria);

module.exports = router;
