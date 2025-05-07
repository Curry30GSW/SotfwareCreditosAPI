const express = require('express');
const router = express.Router();
const actaCreditosController = require('../controllers/actaCreditosController');

router.get('/terceros', actaCreditosController.getActaTerceros);
router.get('/virtuales', actaCreditosController.getActaVirtuales);
router.get('/excedencias', actaCreditosController.getActaExcedencias);

module.exports = router;
