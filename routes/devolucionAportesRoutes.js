const express = require('express');
const router = express.Router();
const {
    verAportesSociales,
    verAportesOcasionales,
    registrarAuditoriaModulo
} = require('../controllers/devolucionAportesController'); // Ajusta la ruta si es diferente
const verifyToken = require('../middlewares/authMiddleware.js');


// Ruta para ver los aportes sociales
router.get('/aportes-sociales', verAportesSociales);

// Ruta para ver los aportes ocasionales
router.get('/aportes-ocasionales', verAportesOcasionales);

// Ruta para audioria
router.post('/auditoria/moduloD', verifyToken, registrarAuditoriaModulo )

module.exports = router;
