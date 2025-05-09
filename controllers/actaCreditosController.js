const actaCreditosModel = require('../models/actaCreditosModel');

// Función para limpiar espacios de las propiedades de los objetos
const limpiarData = (data) => {
    return data.map((item) => {
        let cleanedItem = {};
        for (let key in item) {
            if (item.hasOwnProperty(key)) {
                // Eliminar espacios en las propiedades y en los valores de las propiedades
                cleanedItem[key.trim()] = (item[key] && typeof item[key] === 'string') ? item[key].trim() : item[key];
            }
        }
        return cleanedItem;
    });
};

const getActaTerceros = async (req, res) => {
    try {
        const datos = await actaCreditosModel.obtenerActaTerceros();
        const datosLimpios = limpiarData(datos);
        res.status(200).json(datosLimpios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener acta de terceros', error });
    }
};

const getActaVirtuales = async (req, res) => {
    try {
        const datos = await actaCreditosModel.obtenerActaVirtuales();
        const datosLimpios = limpiarData(datos);
        res.status(200).json(datosLimpios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener acta de virtuales', error });
    }
};

const getActaExcedencias = async (req, res) => {
    try {
        const datos = await actaCreditosModel.obtenerActaExcedencias();
        const datosLimpios = limpiarData(datos);
        res.status(200).json(datosLimpios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener acta de excedencias', error });
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

        const detalle_actividad = `${nombre_usuario} ingresó al modulo ACTAS DE CREDITOS `;

        // Registrar en la auditoría
        await actaCreditosModel.registrarAuditoriaMod(
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
    getActaTerceros,
    getActaVirtuales,
    getActaExcedencias,
    registrarAuditoriaModulo
};
