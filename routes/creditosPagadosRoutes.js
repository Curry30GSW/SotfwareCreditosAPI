const express = require('express');
const router = express.Router();
const { contarPagados, guardarPagado } = require('../controllers/creditosPagadosController');
const verifyToken = require('../middlewares/authMiddleware.js');

router.get('/pagados/creditos', verifyToken, contarPagados);
router.post('/guardar/creditos', guardarPagado);

module.exports = router;
