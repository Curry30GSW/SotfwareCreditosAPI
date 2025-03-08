const { obtenerPagados } = require('../models/creditosPagadosModel');

const contarPagados = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query; // Recibe las fechas desde el frontend

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ error: 'Las fechas son obligatorias' });
        }

        // Convertir fechas al formato AS400 (125MMDD)
        const formatoAS400 = (fecha) => {
            const fechaObj = new Date(fecha);
            const anioAS400 = (fechaObj.getFullYear() - 1900).toString().slice(-2);
            const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
            const dia = String(fechaObj.getDate()).padStart(2, '0');
            return `1${anioAS400}${mes}${dia}`;
        };

        const fechaInicioAS400 = formatoAS400(fechaInicio);
        const fechaFinAS400 = formatoAS400(fechaFin);

        const pagados = await obtenerPagados(fechaInicioAS400, fechaFinAS400);
        res.json({ pagados });

    } catch (error) {
        console.error('❌ Error en contarPagados:', error);
        res.status(500).json({ error: 'Error al obtener los pagarés pagados' });
    }
};

module.exports = { contarPagados };
