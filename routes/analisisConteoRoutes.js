const express = require('express');
const router = express.Router();
const { getAnalisisCero, getAnalisisUno, getAnalisisDos, getAnalisisTres } = require('../controllers/analisisConteoController');

router.get('/analisis-cero', getAnalisisCero);
router.get('/analisis-uno', getAnalisisUno);
router.get('/analisis-dos', getAnalisisDos);
router.get('/analisis-tres', getAnalisisTres);

module.exports = router;
