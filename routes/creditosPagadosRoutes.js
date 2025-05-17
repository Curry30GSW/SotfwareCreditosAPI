const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { contarPagados, guardarPagado, guardarPagadosLote, verCreditosTesoreria, verCreditosTesoreriaTerceros, verpagoApoderados, getCreditosPorCedula, registrarAuditoriaModulo } = require('../controllers/creditosPagadosController');
const verifyToken = require('../middlewares/authMiddleware.js');
const { insertarPagados } = require('../models/creditosPagadosModel.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, 'C:/Users/root/Desktop/ConciliacionFull/conciliacion/soporteComprobantes');  // debo cmbiar la ruta de donde s guarda las capetas 1144041231 --front
        cb(null, 'C:/Users/root/Desktop/SOTFWARECREDITOS/SotfwareCreditosAPI/soporteComprobantes');  // --backend  --> front <td> poner despues :5000/soporteComprobantes/${bla bla}
    },
    filename: function (req, file, cb) {
        // Usa timestamp como nombre temporal
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        cb(null, `temp-${timestamp}${extension}`);
    }
});

const upload = multer({ storage });


router.get('/pagados/creditos', verifyToken, contarPagados);


router.post('/guardar/creditos', verifyToken, upload.single('archivo'), guardarPagado);




router.post('/guardar/creditos-lote', verifyToken, guardarPagadosLote);
router.get('/obtener/pagados', verifyToken, verCreditosTesoreria);
router.get('/obtener/pagados-terceros', verifyToken, verCreditosTesoreriaTerceros);
router.get('/obtener/apoderados', verifyToken, verpagoApoderados);
router.get('/creditos/:cedula', getCreditosPorCedula);
router.post('/auditoria/moduloPT', verifyToken, registrarAuditoriaModulo);

module.exports = router;
