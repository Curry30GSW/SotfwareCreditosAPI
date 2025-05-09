const { obtenerTransferenciasRechazadas, obtenerTransferenciasRechazadasTerceros, registrarAuditoriaMod } = require('../models/transferenciasErrorModel');

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

const registrarAuditoriaModulo = async (req, res) => {

    try {
        const { nombre_usuario, rol } = req.body;

        // Capturar IP real desde la conexión
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

        // Limpiar el "::ffff:" si existe
        if (ip && ip.startsWith('::ffff:')) {
            ip = ip.replace('::ffff:', '');
        }

        const detalle_actividad = `${nombre_usuario} ingresó al modulo de TRANSFERENCIA ERROR `;

        // Registrar en la auditoría
        await registrarAuditoriaMod(
            nombre_usuario,
            rol,
            ip,
            detalle_actividad
        );
        res.json({ status: 'ok', message: 'Auditoría registrada correctamente' });
    } catch (error) {
        console.error('❌ Error al registrar auditoría de estado de crédito:', error);
        res.status(500).json({ status: 'error', message: 'No se pudo registrar la auditoría' });
    }


}


module.exports = {
    getTransferenciasRechazadas,
    getTransferenciasRechazadasTerceros,
    registrarAuditoriaModulo
};
