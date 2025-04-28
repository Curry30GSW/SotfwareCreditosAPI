const express = require('express');
const router = express.Router();
const { getCreditosAS400, contarCreditosAS400, registrarAuditoriaEstadoCredito } = require('../controllers/creditosAS400Controller');
const verifyToken = require('../middlewares/authMiddleware.js');

router.get('/creditos', verifyToken, getCreditosAS400);
router.get('/creditos/count', verifyToken, contarCreditosAS400);
router.post('/auditoria/estado-credito', verifyToken, registrarAuditoriaEstadoCredito);
module.exports = router;
