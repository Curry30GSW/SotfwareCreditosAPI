const { obtenerAporteSociales, obtenerAporteOcasionales, registrarAuditoriaMod } = require('../models/devolucionAportesModel');

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

const registrarAuditoriaModulo = async (req, res) => {

    try {
        const { nombre_usuario, rol } = req.body;

        // Capturar IP real desde la conexión
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

        // Limpiar el "::ffff:" si existe
        if (ip && ip.startsWith('::ffff:')) {
            ip = ip.replace('::ffff:', '');
        }

        const detalle_actividad = `${nombre_usuario} ingresó al modulo DEVOLUCION DE APO `;

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
    verAportesSociales,
    verAportesOcasionales,
    registrarAuditoriaModulo
};
