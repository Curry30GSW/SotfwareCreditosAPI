// routes/creditosPagares.js
const express = require('express');
const router = express.Router();
const { getCreditosPagares } = require('../controllers/creditosPagaresController');

// Ruta para obtener los créditos y pagarés
router.get('/creditos/pagares', getCreditosPagares);

module.exports = router;
