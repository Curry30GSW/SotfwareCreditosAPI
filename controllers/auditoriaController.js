const { getAuditoria } = require('../models/auditoriaModel');

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

module.exports = {
    obtenerAuditoria
};
