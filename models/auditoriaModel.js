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



const registrarAuditoriaDes = async (nombre_usuario, rol, ip_usuario, detalle_actividad) => {
    const query = `INSERT INTO conciliacion_auditoria 
            (nombre_usuario, rol, ip_usuario, fecha_acceso, hora_acceso, detalle_actividad) 
            VALUES (?, ?, ?, NOW(), NOW(), ?)
            `;

    await executeQuery(query, [nombre_usuario, rol, ip_usuario, detalle_actividad
    ], 'PAGARES')
    return query;

}

module.exports = { getAuditoria, registrarAuditoriaDes };