const { getAuditoria, registrarAuditoriaDes } = require('../models/auditoriaModel');

const obtenerAuditoria = async (req, res) => {
    try {
        const data = await getAuditoria();

        // Validar si data es un array, si no lo es, enviar un error claro
        if (!Array.isArray(data)) {
            return res.status(500).json({ mensaje: 'Los datos recibidos no tienen el formato esperado' });
        }

        res.json(data);
    } catch (error) {
        console.error('Error en el controlador de auditoría:', error);
        res.status(500).json({ mensaje: 'Error al obtener auditoría' });
    }
};

const descargarAudi = async (req, res) => {
    try {
        const { nombre_usuario, rol } = req.body;

        // Capturar IP real desde la conexión
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

        // Limpiar el "::ffff:" si existe
        if (ip && ip.startsWith('::ffff:')) {
            ip = ip.replace('::ffff:', '');
        }

        const detalle_actividad = `${nombre_usuario} EXPORTÓ EL ACTA DE CRÉDTIOS `;

        // Registrar en la auditoría
        await registrarAuditoriaDes(
            nombre_usuario,
            rol,
            ip,
            detalle_actividad
        );
        res.json({ status: 'ok', message: 'Auditoría registrada correctamente' });
    } catch (error) {
        console.error('Error en el controlador de auditoría:', error);
        res.status(500).json({ mensaje: 'Error al obtener auditoría' });
    }
};

module.exports = {
    obtenerAuditoria, descargarAudi
};
