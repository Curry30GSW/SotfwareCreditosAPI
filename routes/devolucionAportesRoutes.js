const express = require('express');
const router = express.Router();

const {
    verAportesSociales,
    verAportesOcasionales
} = require('../controllers/devolucionAportesController'); // Ajusta la ruta si es diferente

// Ruta para ver los aportes sociales
router.get('/aportes-sociales', verAportesSociales);

// Ruta para ver los aportes ocasionales
router.get('/aportes-ocasionales', verAportesOcasionales);

module.exports = router;
