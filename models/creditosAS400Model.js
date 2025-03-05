const { executeQuery } = require('../config/db');

const creditosAS400 = {
    async getCreditosAS400() {
        try {
            const [lapsoInicio, lapsoFin] = obtenerRangoFechasActual();
            const tableACP05 = `COLIB.ACP05`;
            const tableACP06 = `COLIB.ACP06`;
            const tableACP13 = `COLIB.ACP13`;


            const queryCreditosData = `
                SELECT 
                    ${tableACP13}.AGOP13, 
                    ${tableACP13}.NCTA13, 
                    ${tableACP05}.NNIT05, 
                    ${tableACP05}.DESC05, 
                    ${tableACP13}.LAPI13, 
                    ${tableACP13}.FECI13,
                    ${tableACP13}.TCRE13, 
                    ${tableACP13}.NCRE13, 
                    ${tableACP13}.ORSU13, 
                    ${tableACP13}.CAPI13, 
                    ${tableACP13}.TASA13, 
                    ${tableACP13}.SCAP13, 
                    ${tableACP05}.DIRE05,
                    ${tableACP05}.CIUD05, 
                    ${tableACP06}.DESC06, 
                    ${tableACP06}.CLAS06, 
                    ${tableACP13}.CPTO13
                FROM 
                    ${tableACP05}
                JOIN 
                    ${tableACP13} 
                ON 
                    ${tableACP05}.EMPR05 = ${tableACP13}.EMPR13 
                    AND ${tableACP05}.NCTA05 = ${tableACP13}.NCTA13
                JOIN 
                    ${tableACP06} 
                ON 
                    ${tableACP13}.TCRE13 = ${tableACP06}.TCRE06
                WHERE 
                    ${tableACP13}.CAPI13 > 0
                    AND ${tableACP13}.TCRE13 <> '74'
                    AND ${tableACP13}.FECI13 BETWEEN ? AND ?
            `;

            const result = await executeQuery(queryCreditosData, [lapsoInicio, lapsoFin]);
            return result;
        } catch (error) {
            console.error('Error al obtener créditos:', error);
            throw error;
        }
    },

    // Nueva función para contar los créditos sin afectar la consulta original
    async contarCreditosAS400() {
        try {
            const tableACP13 = `COLIB.ACP13`;

            // Obtener el primer día del mes y la fecha actual
            const [lapsoInicio, lapsoFin] = obtenerRangoFechasActual();

            const queryCount = `
                SELECT COUNT(*) AS total
                FROM ${tableACP13}
                WHERE CAPI13 > 0
                AND TCRE13 <> '74'
                AND FECI13 BETWEEN ? AND ?
            `;

            const result = await executeQuery(queryCount, [lapsoInicio, lapsoFin]);

            return result[0]?.total || 0;
        } catch (error) {
            console.error('Error al contar los créditos:', error);
            throw error;
        }
    }
};

function obtenerRangoFechasActual() {
    const hoy = new Date();

    // Obtener el primer día del mes en formato AS400 (1AAMMDD)
    let añoAs400 = `1${(hoy.getFullYear() - 1900).toString().slice(-2)}`; // Ej: 2024 → 124
    let mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes actual

    let fechaInicio = `${añoAs400}${mes}01`; // Primer día del mes
    let fechaFin = `${añoAs400}${mes}${String(hoy.getDate()).padStart(2, '0')}`; // Fecha actual

    return [fechaInicio, fechaFin];
}

function obtenerRangoLapsos() {
    const fechaActual = new Date();

    // Obtener año y mes actual
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; // Enero es 0, por eso sumamos 1

    // Calcular el lapso del mes anterior
    let mesAnterior = mes - 1;
    let añoAnterior = año;
    if (mesAnterior === 0) {
        mesAnterior = 12;
        añoAnterior -= 1;
    }

    // Formato de lapso (AAMM) → 202403 para marzo 2024
    const lapsoInicio = parseInt(`${añoAnterior.toString().slice(-2)}${mesAnterior.toString().padStart(2, '0')}`) + 10000;
    const lapsoFin = parseInt(`${año.toString().slice(-2)}${mes.toString().padStart(2, '0')}`) + 10000;

    return [lapsoInicio, lapsoFin];
}



module.exports = creditosAS400;

