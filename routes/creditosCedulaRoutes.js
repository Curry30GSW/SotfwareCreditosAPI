const express = require('express');
const router = express.Router();
const creditosCedulaController = require('../controllers/creditosCedulaController')
const verifyToken = require('../middlewares/authMiddleware.js');


router.get('/credito/:cedula', verifyToken, creditosCedulaController.mostrarCredito);


// Ruta para audioria
router.post('/auditoria/moduloCC', verifyToken, creditosCedulaController.registrarAuditoriaModulo )

module.exports = router;
