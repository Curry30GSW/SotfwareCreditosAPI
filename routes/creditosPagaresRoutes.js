// routes/creditosPagares.js
const express = require('express');
const router = express.Router();
const { getCreditosPagares } = require('../controllers/creditosPagaresController');
const verifyToken = require('../middlewares/authMiddleware.js');

// Ruta para obtener los créditos y pagarés
router.get('/creditos/pagares', verifyToken, getCreditosPagares);

module.exports = router;
