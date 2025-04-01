const { executeQuery } = require('../config/db');

const creditosAS400 = {
    async getCreditosAS400() {
        try {
            const [lapsoInicio, lapsoFin] = obtenerRangoFechasActual();
            const tableACP03 = `COLIB.ACP03`;
            const tableACP04 = `COLIB.ACP04`;
            const tableACP05 = `COLIB.ACP05`;
            const tableACP06 = `COLIB.ACP06`;
            const tableACP13 = `COLIB.ACP13`;
            const tableACP23 = `COLIB.ACP23`;

            const queryCreditosData = `
                SELECT 
                    ${tableACP03}.DIRE03, 
                    ${tableACP13}.AGOP13, 
                    ${tableACP03}.DESC03, 
                    ${tableACP13}.NCTA13, 
                    ${tableACP05}.NNIT05, 
                    ${tableACP05}.DESC05, 
                    ${tableACP05}.FECN05, 
                    ${tableACP13}.FECI13, 
                    ${tableACP13}.NCRE13, 
                    ${tableACP13}.CAPI13, 
                    ${tableACP13}.TASA13, 
                    ${tableACP13}.TCRE13, 
                    ${tableACP13}.CPTO13, 
                    ${tableACP06}.DESC06, 
                    ${tableACP04}.DESC04, 
                    ${tableACP13}.NANA13, 
                    ${tableACP23}.FECH23, 
                    ${tableACP23}.STAT23 
                FROM 
                    ${tableACP03}, 
                    ${tableACP04}, 
                    ${tableACP05}, 
                    ${tableACP06}, 
                    ${tableACP13}, 
                    ${tableACP23} 
                WHERE 
                    ${tableACP05}.NCTA05 = ${tableACP13}.NCTA13 
                    AND ${tableACP13}.TCRE13 = ${tableACP06}.TCRE06 
                    AND ${tableACP05}.NOMI05 = ${tableACP04}.NOMI04 
                    AND ${tableACP23}.NANA23 = ${tableACP13}.NANA13 
                    AND ${tableACP13}.NCTA13 = ${tableACP23}.NCTA23 
                    AND ${tableACP05}.DIST05 = ${tableACP03}.DIST03 
                    AND ${tableACP13}.TCRE13 <> '74' 
                    AND ${tableACP13}.FECI13 BETWEEN ? AND ?
            `;

            let creditos = await executeQuery(queryCreditosData, [lapsoInicio, lapsoFin]);

            // ✅ Consultar los Scores en la base de datos Pagares (menu_datacredito)
            const queryScores = `SELECT cedula, Score FROM persona`;
            let scores = await executeQuery(queryScores, [], 'Pagares');

            let scoresMap = {};
            scores.forEach(persona => {
                scoresMap[String(parseInt(persona.cedula, 10))] = persona.Score;
            });

            // Agregar el Score al resultado de créditos
            creditos = creditos.map(credito => ({
                ...credito,
                Score: scoresMap[String(parseInt(credito.NNIT05, 10))] || 'F/D'
            }));

            return creditos;
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

// function obtenerRangoLapsos() {
//     const fechaActual = new Date();

//     // Obtener año y mes actual
//     const año = fechaActual.getFullYear();
//     const mes = fechaActual.getMonth() + 1; // Enero es 0, por eso sumamos 1

//     // Calcular el lapso del mes anterior
//     let mesAnterior = mes - 1;
//     let añoAnterior = año;
//     if (mesAnterior === 0) {
//         mesAnterior = 12;
//         añoAnterior -= 1;
//     }

//     // Formato de lapso (AAMM) → 202403 para marzo 2024
//     const lapsoInicio = parseInt(`${añoAnterior.toString().slice(-2)}${mesAnterior.toString().padStart(2, '0')}`) + 10000;
//     const lapsoFin = parseInt(`${año.toString().slice(-2)}${mes.toString().padStart(2, '0')}`) + 10000;

//     return [lapsoInicio, lapsoFin];
// }



module.exports = creditosAS400;

