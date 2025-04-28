const { executeQuery } = require('../config/db');

const getAuditoria = async () => {
    try {
        const rows = await executeQuery(`
        SELECT * FROM conciliacion_auditoria
        `, [], 'PAGARES'); // Asegúrate de que diga 'PAGARES' aquí para usar la conexión correcta
        return rows;
    } catch (error) {
        console.error('Error en getAuditoria (modelo):', error);
        throw error;
    }
};

module.exports = { getAuditoria };