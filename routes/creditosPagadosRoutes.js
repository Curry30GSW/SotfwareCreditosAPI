const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { contarPagados, guardarPagado, guardarPagadosLote, verCreditosTesoreria, verCreditosTesoreriaTerceros, verpagoApoderados, getCreditosPorCedula, registrarAuditoriaModulo } = require('../controllers/creditosPagadosController');
const verifyToken = require('../middlewares/authMiddleware.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'C:/Users/root/Desktop/ConciliacionFull/conciliacion/soporteComprobantes');
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
// router.post('/guardar/creditos', verifyToken, upload.single('archivo'), guardarPagado);
router.post('/guardar/creditos', upload.single('archivo'), (req, res) => {
    const cedula = req.body.cedula;

    if (!cedula) {
        return res.status(400).json({ error: 'Cédula no proporcionada' });
    }

    const fs = require('fs');
    const oldPath = req.file.path;
    const newFilename = `comprobante-${cedula}${path.extname(req.file.originalname)}`;
    const newPath = path.join(req.file.destination, newFilename);

    // Renombrar el archivo
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al renombrar el archivo' });
        }

        res.json({ mensaje: 'Archivo subido correctamente', archivo: newFilename });
    });
});
router.post('/guardar/creditos-lote', verifyToken, guardarPagadosLote);
router.get('/obtener/pagados', verifyToken, verCreditosTesoreria);
router.get('/obtener/pagados-terceros', verifyToken, verCreditosTesoreriaTerceros);
router.get('/obtener/apoderados', verifyToken, verpagoApoderados);
router.get('/creditos/:cedula', getCreditosPorCedula);
router.post('/auditoria/moduloPT', verifyToken, registrarAuditoriaModulo);

module.exports = router;
