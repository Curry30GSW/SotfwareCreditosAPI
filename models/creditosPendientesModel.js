const { executeQuery } = require('../config/db');

const creditosPendientesAS400 = {
    async getCreditosPendientesAS400(mesInt) {
        try {
            const tableACP03 = `COLIB.ACP03`;
            const tableACP04 = `COLIB.ACP04`;
            const tableACP05 = `COLIB.ACP05`;
            const tableACP06 = `COLIB.ACP06`;
            const tableACP26 = `COLIB.ACP26`;
            const tableACP23 = `COLIB.ACP23`;

            const fechas = obtenerUltimosSeisMeses();
            const fechaInicio = fechas[mesInt * 2];
            const fechaFin = fechas[mesInt * 2 + 1];

            // Consulta de créditos pendientes en AS400
            const queryCreditosPendienteData = `
                SELECT 
                    ${tableACP03}.DESC03,
                    ${tableACP03}.DIRE03,
                    ${tableACP03}.DIST03, 
                    ${tableACP26}.NCTA26,
                    ${tableACP05}.NNIT05, 
                    ${tableACP05}.DESC05, 
                    ${tableACP23}.FECH23, 
                    ${tableACP26}.TCRE26, 
                    ${tableACP26}.CPTO26, 
                    ${tableACP26}.NCRE26,
                    ${tableACP26}.NANA26, 
                    ${tableACP26}.SCAP26, 
                    ${tableACP26}.TASA26, 
                    ${tableACP26}.LAPS26, 
                    ${tableACP05}.FECN05, 
                    ${tableACP06}.DESC06, 
                    ${tableACP06}.CLAS06, 
                    ${tableACP04}.DESC04
                FROM 
                    ${tableACP03},
                    ${tableACP04}, 
                    ${tableACP05}, 
                    ${tableACP06}, 
                    ${tableACP26},
                    ${tableACP23}
                WHERE 
                    ${tableACP26}.NCTA26 = ${tableACP05}.NCTA05 
                    AND ${tableACP26}.TCRE26 = ${tableACP06}.TCRE06 
                    AND ${tableACP05}.NOMI05 = ${tableACP04}.NOMI04 
                    AND ${tableACP03}.DIST03 = ${tableACP26}.AGOP26
                    AND ${tableACP26}.FECI26 BETWEEN '${fechaInicio}' AND '${fechaFin}'
                    AND ${tableACP26}.NCTA26 = ${tableACP23}.NCTA23
                    AND ${tableACP26}.NANA26 = ${tableACP23}.NANA23
                ORDER BY 
                    ${tableACP03}.DESC03
            `;

            let creditos = await executeQuery(queryCreditosPendienteData, [], 'AS400');

            // ✅ Consultar los Scores en la base de datos Pagares (menu_datacredito)
            const queryScores = `SELECT cedula, Score FROM persona`;
            let scores = await executeQuery(queryScores, [], 'Pagares'); // 🔹 Usa la conexión de Pagares


            let scoresMap = {};
            scores.forEach(persona => {
                scoresMap[String(parseInt(persona.cedula, 10))] = persona.Score;
            });


            // Agregar el Score al resultado de créditos pendientes
            creditos = creditos.map(credito => ({
                ...credito,
                Score: scoresMap[String(parseInt(credito.NNIT05, 10))] || 'F/D'
            }));


            return creditos;
        } catch (error) {
            console.error('Error al obtener créditos pendientes:', error);
            throw error;
        }
    },
    async contarCuentasPendientesAS400(mesInt) {
        try {
            const tableACP26 = `COLIB.ACP26`;

            // Obtener fechas dinámicamente
            const fechas = obtenerUltimosSeisMeses();
            const fechaInicio = fechas[mesInt * 2];
            const fechaFin = fechas[mesInt * 2 + 1];


            const queryContarCuentas = `
                SELECT COUNT(DISTINCT ${tableACP26}.NCTA26) AS total_cuentas
                FROM ${tableACP26}
                WHERE ${tableACP26}.FECI26 BETWEEN '${fechaInicio}' AND '${fechaFin}'
            `;

            const result = await executeQuery(queryContarCuentas);

            return result[0]?.TOTAL_CUENTAS || 0;
        } catch (error) {
            console.error('Error al contar cuentas pendientes:', error);
            throw error;
        }
    },


};

// Función para calcular los últimos 3 meses en formato AS400 (1AAMMDD)
function obtenerUltimosSeisMeses() {
    const hoy = new Date();
    let meses = [];

    for (let i = 1; i <= 7; i++) {
        let fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
        let fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() - i + 1, 0); // Último día del mes

        let añoAs400 = `1${(fechaInicio.getFullYear() - 1900).toString().slice(-2)}`;
        let mes = String(fechaInicio.getMonth() + 1).padStart(2, '0');
        let inicio = `${añoAs400}${mes}01`;
        let fin = `${añoAs400}${mes}${String(fechaFin.getDate()).padStart(2, '0')}`;

        meses.push(inicio, fin);
    }

    return meses;
}






module.exports = creditosPendientesAS400;
