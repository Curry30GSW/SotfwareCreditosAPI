const { obtenerTransferenciasRechazadas, obtenerTransferenciasRechazadasTerceros } = require('../models/transferenciasErrorModel');

const getTransferenciasRechazadas = async (req, res) => {
    try {
        const { cuentas, fecha } = req.body;

        if (!cuentas || !fecha) {
            return res.status(400).json({ error: 'Se requieren las cuentas y la fecha' });
        }

        const resultado = await obtenerTransferenciasRechazadas(cuentas, fecha);
        const resultadoLimpio = resultado.map(item => {
            const limpio = {};
            for (let key in item) {
                limpio[key] = typeof item[key] === 'string' ? item[key].trim() : item[key];
            }
            return limpio;
        });

        res.status(200).json(resultadoLimpio);
    } catch (error) {
        console.error('Error en el controlador:', error);
        res.status(500).json({ error: 'Error al obtener las transferencias rechazadas' });
    }
};


const getTransferenciasRechazadasTerceros = async (req, res) => {
    try {
        const { cuentas, fecha } = req.body;

        if (!cuentas || !fecha) {
            return res.status(400).json({ error: 'Se requieren las cuentas y la fecha' });
        }

        const resultado = await obtenerTransferenciasRechazadasTerceros(cuentas, fecha);

        const resultadoLimpio = resultado.map(item => {
            const limpio = {};
            for (let key in item) {
                limpio[key] = typeof item[key] === 'string' ? item[key].trim() : item[key];
            }
            return limpio;
        });

        res.status(200).json(resultadoLimpio);

    } catch (error) {
        console.error('Error en el controlador (terceros):', error);
        res.status(500).json({ error: 'Error al obtener las transferencias rechazadas de terceros' });
    }
};

module.exports = {
    getTransferenciasRechazadas,
    getTransferenciasRechazadasTerceros
};
