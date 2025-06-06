const express = require('express');
const router = express.Router();
const creditosNoRegistradosController = require('../controllers/creditosNoRegistradosController');
const verifyToken = require('../middlewares/authMiddleware.js');

// Ruta para obtener los créditos no registrados
router.get('/creditos-no-registrados', verifyToken, creditosNoRegistradosController.listarCreditosNoRegistrados);

// Ruta para audioria
router.post('/auditoria/moduloN', verifyToken, creditosNoRegistradosController.registrarAuditoriaModulo )

module.exports = router;
