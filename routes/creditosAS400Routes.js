const express = require('express');
const router = express.Router();
const { getCreditosAS400, contarCreditosAS400 } = require('../controllers/creditosAS400Controller');

router.get('/creditos', getCreditosAS400);
router.get('/creditos/count', contarCreditosAS400);
module.exports = router;
