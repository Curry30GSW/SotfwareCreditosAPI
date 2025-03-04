const {
    obtenerDetallesCero,
    obtenerDetallesUno,
    obtenerDetallesDos,
    obtenerDetallesTres
} = require('../models/detallesAnalisisModel');

async function getDetallesCero(req, res) {
    const { agen23 } = req.params;
    try {
        const detalles = await obtenerDetallesCero(agen23);
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los detalles con STAT23 = 0." });
    }
}

async function getDetallesUno(req, res) {
    const { agen23 } = req.params;
    try {
        const detalles = await obtenerDetallesUno(agen23);
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los detalles con STAT23 = 1." });
    }
}

async function getDetallesDos(req, res) {
    const { agen23 } = req.params;
    try {
        const detalles = await obtenerDetallesDos(agen23);
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los detalles con STAT23 = 2." });
    }
}

async function getDetallesTres(req, res) {
    const { agen23 } = req.params;
    try {
        const detalles = await obtenerDetallesTres(agen23);
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los detalles con STAT23 = 3." });
    }
}

module.exports = {
    getDetallesCero,
    getDetallesUno,
    getDetallesDos,
    getDetallesTres
};
