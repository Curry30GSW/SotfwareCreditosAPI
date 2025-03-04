const { obtenerCreditosPagares } = require('../models/creditosPagaresModel');

const getCreditosPagares = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ error: 'Debe proporcionar fechaInicio y fechaFin' });
        }

        const data = await obtenerCreditosPagares(fechaInicio, fechaFin);
        res.json({ total: data.length, data });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};

module.exports = { getCreditosPagares };