const express = require('express');
const AuditoriaController = require('../controllers/auditoriaController');
const router = express.Router();


// Ruta para obtener los datos de auditoría
router.get('/auditoria', AuditoriaController.obtenerAuditoria);
router.post('/auditoria/descargar', AuditoriaController.descargarAudi);


module.exports = router;
