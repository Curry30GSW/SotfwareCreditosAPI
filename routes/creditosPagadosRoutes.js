const express = require('express');
const router = express.Router();
const { contarPagados } = require('../controllers/creditosPagadosController');
const verifyToken = require('../middlewares/authMiddleware.js');

router.get('/pagados/creditos', verifyToken, contarPagados);

module.exports = router;
