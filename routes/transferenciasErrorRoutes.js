const express = require('express');
const router = express.Router();
const {
    getTransferenciasRechazadas,
    getTransferenciasRechazadasTerceros
} = require('../controllers/transferenciasErrorController');


router.post('/transferencias-rechazadas', getTransferenciasRechazadas);

router.post('/transferencias-rechazadas-terceros', getTransferenciasRechazadasTerceros);

module.exports = router;
