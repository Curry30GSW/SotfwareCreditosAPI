const express = require('express');
const router = express.Router();
const {
    getTransferenciasRechazadas,
    getTransferenciasRechazadasTerceros,
    registrarAuditoriaModulo
} = require('../controllers/transferenciasErrorController');
const verifyToken = require('../middlewares/authMiddleware.js');


router.post('/transferencias-rechazadas', getTransferenciasRechazadas);

router.post('/transferencias-rechazadas-terceros', getTransferenciasRechazadasTerceros);

// Ruta para audioria
router.post('/auditoria/moduloTE', verifyToken, registrarAuditoriaModulo );

module.exports = router;

 


//  ´3127287427´