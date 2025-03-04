const { obtenerPagados } = require('../models/creditosPagadosModel');

const contarPagados = async (req, res) => {
    try {
        const pagados = await obtenerPagados();
        res.json({ pagados });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pagarés pagados' });
    }
};

module.exports = { contarPagados };
