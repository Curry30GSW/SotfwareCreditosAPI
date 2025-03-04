const express = require('express');
const router = express.Router();
const {
    getDetallesCero,
    getDetallesUno,
    getDetallesDos,
    getDetallesTres
} = require('../controllers/detallesAnalisisController');

router.get("/detallesAnalisisCero/:agen23", getDetallesCero);
router.get("/detallesAnalisisUno/:agen23", getDetallesUno);
router.get("/detallesAnalisisDos/:agen23", getDetallesDos);
router.get("/detallesAnalisisTres/:agen23", getDetallesTres);

module.exports = router;
