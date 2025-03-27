const analisisModel = require('../models/analisisResumenModel');

const obtenerAnalisis = async (req, res) => {
    try {
        const { mes, estado } = req.params;
        const resultado = await analisisModel.obtenerAnalisisPorEstado(parseInt(mes, 10), estado);
        res.status(200).json(resultado);
    } catch (error) {
        console.error(`Error en obtenerAnalisis (${req.params.estado}):`, error);
        res.status(500).json({ error: `Error al obtener el análisis de estado ${req.params.estado}` });
    }
};


const obtenerDatosPorAgencia = async (req, res) => {
    try {
        const { agencia, mes, estado } = req.params;
        const resultado = await analisisModel.obtenerDatosPorAgenciaYFechas(agencia, parseInt(mes, 10), estado);
        res.status(200).json(resultado);
    } catch (error) {
        console.error(`Error en obtenerDatosPorAgencia (${req.params.agencia}):`, error);
        res.status(500).json({ error: `Error al obtener los datos de la agencia ${req.params.agencia}` });
    }
};



module.exports = { obtenerAnalisis, obtenerDatosPorAgencia };