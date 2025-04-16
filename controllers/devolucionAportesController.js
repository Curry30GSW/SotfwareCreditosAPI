const { obtenerAporteSociales, obtenerAporteOcasionales } = require('../models/devolucionAportesModel');

const verAportesSociales = async (req, res) => {
    try {
        const data = await obtenerAporteSociales();

        const dataLimpia = data.map((item) => {
            const nuevoItem = {};
            for (const key in item) {
                const valor = item[key];
                nuevoItem[key] = typeof valor === 'string' ? valor.trim() : valor;
            }
            return nuevoItem;
        });

        res.json(dataLimpia);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los aportes sociales' });
    }
};

const verAportesOcasionales = async (req, res) => {
    try {
        const data = await obtenerAporteOcasionales();

        const dataLimpia = data.map((item) => {
            const nuevoItem = {};
            for (const key in item) {
                const valor = item[key];
                nuevoItem[key] = typeof valor === 'string' ? valor.trim() : valor;
            }
            return nuevoItem;
        });

        res.json(dataLimpia);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los aportes ocasionales' });
    }
};

module.exports = {
    verAportesSociales,
    verAportesOcasionales
};
