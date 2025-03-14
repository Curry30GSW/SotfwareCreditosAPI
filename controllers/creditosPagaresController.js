const { obtenerCreditosPagares } = require('../models/creditosPagaresModel');

const getCreditosPagares = async (req, res) => {
    try {
        let { fechaInicio, fechaFin } = req.query;

        // Validar si no hay fechas y asignar valores predeterminados
        if (!fechaInicio || !fechaFin) {
            const fechaActual = new Date();
            const año = fechaActual.getFullYear();
            const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
            const dia = String(fechaActual.getDate()).padStart(2, '0');

            fechaInicio = `${año}-${mes}-01`;  // Primer día del mes
            fechaFin = `${año}-${mes}-${dia}`; // Día actual
        }
        // Obtener los datos con las fechas proporcionadas
        const data = await obtenerCreditosPagares(fechaInicio, fechaFin);
        res.json({ total: data.length, data });

    } catch (error) {
        console.error('❌ Error en getCreditosPagares:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};

module.exports = { getCreditosPagares };
