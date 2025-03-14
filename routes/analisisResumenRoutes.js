const express = require('express');
const router = express.Router();
const analisisResumenController = require('../controllers/analisisResumenController');
const verifyToken = require('../middlewares/authMiddleware.js');

router.get('/analisis/:estado/:mes', verifyToken, analisisResumenController.obtenerAnalisis);
router.get('/analisis/:estado/:mes/:agencia', verifyToken, analisisResumenController.obtenerDatosPorAgencia);

module.exports = router;
//SEBAS