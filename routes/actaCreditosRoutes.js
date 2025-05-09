const express = require('express');
const router = express.Router();
const actaCreditosController = require('../controllers/actaCreditosController');
const verifyToken = require('../middlewares/authMiddleware.js');


router.get('/terceros', actaCreditosController.getActaTerceros);
router.get('/virtuales', actaCreditosController.getActaVirtuales);
router.get('/excedencias', actaCreditosController.getActaExcedencias);

router.post('/auditoria/moduloAC', verifyToken, actaCreditosController.registrarAuditoriaModulo);

module.exports = router;
