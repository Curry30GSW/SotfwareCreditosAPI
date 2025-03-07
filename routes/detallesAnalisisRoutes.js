const express = require('express');
const router = express.Router();
const {
    getDetallesCero,
    getDetallesUno,
    getDetallesDos,
    getDetallesTres
} = require('../controllers/detallesAnalisisController');
const verifyToken = require('../middlewares/authMiddleware.js');

router.get("/detallesAnalisisCero/:agen23", verifyToken, getDetallesCero);
router.get("/detallesAnalisisUno/:agen23", verifyToken, getDetallesUno);
router.get("/detallesAnalisisDos/:agen23", verifyToken, getDetallesDos);
router.get("/detallesAnalisisTres/:agen23", verifyToken, getDetallesTres);

module.exports = router;
