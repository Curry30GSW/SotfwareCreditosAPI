const express = require('express');
const router = express.Router();
const { getAnalisisCero, getAnalisisUno, getAnalisisDos, getAnalisisTres } = require('../controllers/analisisConteoController');
const verifyToken = require('../middlewares/authMiddleware.js');

router.get('/analisis-cero', verifyToken, getAnalisisCero);
router.get('/analisis-uno', verifyToken, getAnalisisUno);
router.get('/analisis-dos', verifyToken, getAnalisisDos);
router.get('/analisis-tres', verifyToken, getAnalisisTres);

module.exports = router;
