const { obtenerAnalisisCero, obtenerAnalisisUno, obtenerAnalisisDos, obtenerAnalisisTres } = require('../models/analisisConteoModel');

const getAnalisisCero = async (req, res) => {
    try {
        const resultado = await obtenerAnalisisCero();
        res.json(resultado);
    } catch (error) {
        console.error('Error en getAnalisisCero:', error);
        res.status(500).json({ error: 'Error al obtener el análisis cero' });
    }
};

const getAnalisisUno = async (req, res) => {
    try {
        const resultado = await obtenerAnalisisUno();
        res.json(resultado);
    } catch (error) {
        console.error('Error en getAnalisisUno:', error);
        res.status(500).json({ error: 'Error al obtener el análisis uno' });
    }
};

const getAnalisisDos = async (req, res) => {
    try {
        const resultado = await obtenerAnalisisDos();
        res.json(resultado);
    } catch (error) {
        console.error('Error en getAnalisisDos:', error);
        res.status(500).json({ error: 'Error al obtener el análisis dos' });
    }
};

const getAnalisisTres = async (req, res) => {
    try {
        const resultado = await obtenerAnalisisTres();
        res.json(resultado);
    } catch (error) {
        console.error('Error en getAnalisisTres:', error);
        res.status(500).json({ error: 'Error al obtener el análisis tres' });
    }
};

module.exports = { getAnalisisCero, getAnalisisUno, getAnalisisDos, getAnalisisTres };
