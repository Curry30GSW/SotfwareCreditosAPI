const express = require('express');
const router = express.Router();
const { contarPagados } = require('../controllers/creditosPagadosController');

router.get('/pagados/creditos', contarPagados);

module.exports = router;
