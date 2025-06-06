const analisisModel = require('../models/analisisModel');

const analisisController = {
    async obtenerAnalisis(req, res) {
        try {
            const resultado = await analisisModel.getAnalisis();
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener análisis', detalle: error.message });
        }
    },

    async obtenerUltimoConsecutivo(req, res) {
        try {
            const resultado = await analisisModel.getUltimoConsecutivo();
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el último consecutivo', detalle: error.message });
        }
    },

    async obtenerUltimoConsecutivoMesActual(req, res) {
        try {
            const resultado = await analisisModel.getUltimoConsecutivoMesActual();

            if (!resultado || resultado.ultimoConsecutivo.length === 0) {
                return res.status(404).json({ mensaje: 'No se encontraron datos para el mes actual.' });
            }

            res.json(resultado);
        } catch (error) {
            console.error('Error en obtenerUltimoConsecutivoMesActual:', error);
            res.status(500).json({ error: 'Error al obtener el último consecutivo', detalle: error.message });
        }
    },
    async obtenerConsecutivosUltimosMeses(req, res) {
        try {
            const { mes } = req.params;
            const mesInt = parseInt(mes, 10);

            if (isNaN(mesInt) || mesInt < 0 || mesInt > 6) {
                return res.status(400).json({ error: 'Mes inválido. Debe estar entre 0 y 6.' });
            }

            const resultado = await analisisModel.getConsecutivosUltimosMeses(mesInt);
            res.json(resultado);
        } catch (error) {
            console.error('Error en obtenerUltimosConsecutivos:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }


};

module.exports = analisisController;
