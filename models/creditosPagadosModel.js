const { executeQuery } = require('../config/db');

const obtenerPagados = async (fechaInicioAS400, fechaFinAS400) => {
    try {
        const queryAS400 = `
            SELECT COUNT(*) AS totalPagados
            FROM COLIB.ACP13
            WHERE SCAP13 >= 0
            AND TCRE13 <> '74'
            AND FECI13 BETWEEN ? AND ?
        `;

        const resultado = await executeQuery(queryAS400, [fechaInicioAS400, fechaFinAS400]);
        return resultado[0]?.TOTALPAGADOS || 0;

    } catch (error) {
        console.error('❌ Error en obtenerPagados:', error);
        throw error;
    }
};

module.exports = { obtenerPagados };
