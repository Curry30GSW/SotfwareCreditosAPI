const creditosAS400 = require('../models/creditosAS400Model');

const getCreditosAS400 = async (req, res) => {
    try {
        const { fechaInicio, fechaFin, agencia } = req.query;

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ error: 'Las fechas son obligatorias' });
        }

        const formatoAS400 = (fecha) => {
            const [dia, mes, anio] = fecha.split('-');
            const anioAS400 = (parseInt(anio) - 1900).toString().slice(-2);
            return `1${anioAS400}${mes}${dia}`;
        };

        const fechaInicioAS400 = formatoAS400(fechaInicio);
        const fechaFinAS400 = formatoAS400(fechaFin);

        const data = await creditosAS400.getCreditosAS400(fechaInicioAS400, fechaFinAS400, agencia);

        const cleanedData = data.map(credito => ({
            ...credito,
            NNIT05: credito.NNIT05?.trim(),
            DESC05: credito.DESC05?.trim(),
            DESC03: credito.DESC03?.trim(),
            DIRE03: credito.DIRE03?.trim(),
            DESC04: credito.DESC04?.trim(),
            DESC06: credito.DESC06?.trim(),
            CLAS06: credito.CLAS06?.trim(),
            CPTO13: credito.CPTO13?.trim()
        }));

        res.status(200).json(cleanedData);
    } catch (error) {
        console.error('Error en el controlador al obtener créditos:', error);
        res.status(500).json({ error: 'Error al obtener los créditos' });
    }
};

const contarCreditosAS400 = async (req, res) => {
    try {
        const totalCreditos = await creditosAS400.contarCreditosAS400();
        res.json({ pagados: totalCreditos });
    } catch (error) {
        res.status(500).json({ error: 'Error al contar los créditos' });
    }
};

const registrarAuditoriaEstadoCredito = async (req, res) => {
    try {
        const { nombre_usuario, rol, ip_usuario, estado, cuenta, pagare } = req.body;

        const estadoTexto = {
            0: 'NO',
            1: 'SI',
            2: 'TESORERIA'
        }[estado] || 'DESCONOCIDO';

        const detalle_actividad = `La cuenta ${cuenta}, con el pagaré ${pagare}, cambió al estado A: "${estadoTexto}"`;

        await creditosAS400.registrarAuditoriaCre({
            nombre_usuario,
            rol,
            ip_usuario,
            detalle_actividad
        });

        res.json({ status: 'ok', message: 'Auditoría registrada correctamente' });
    } catch (error) {
        console.error('❌ Error al registrar auditoría de estado de crédito:', error);
        res.status(500).json({ status: 'error', message: 'No se pudo registrar la auditoría' });
    }
};



module.exports = { getCreditosAS400, contarCreditosAS400, registrarAuditoriaEstadoCredito };


