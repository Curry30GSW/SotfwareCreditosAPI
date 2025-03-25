const { executeQuery } = require('../config/db');

function obtenerUltimosSeisMeses() {
    const hoy = new Date();

    let fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 6, 1);
    let añoAs400Inicio = `1${(fechaInicio.getFullYear() - 1900).toString().slice(-2)}`;
    let mesInicio = String(fechaInicio.getMonth() + 1).padStart(2, '0');
    let fechaInicioAS400 = `${añoAs400Inicio}${mesInicio}01`;

    let añoAs400Hoy = `1${(hoy.getFullYear() - 1900).toString().slice(-2)}`;
    let mesHoy = String(hoy.getMonth() + 1).padStart(2, '0');
    let diaHoy = String(hoy.getDate()).padStart(2, '0');
    let fechaFinAS400 = `${añoAs400Hoy}${mesHoy}${diaHoy}`;

    return [fechaInicioAS400, fechaFinAS400];
}

const creditosNoRegistrados = {
    async obtenerCreditosNoRegistrados() {
        try {
            const tableACP03 = `COLIB.ACP03`;
            const tableACP04 = `COLIB.ACP04`;
            const tableACP05 = `COLIB.ACP05`;
            const tableACP06 = `COLIB.ACP06`;
            const tableACP13 = `COLIB.ACP13`;

            const [fechaInicio, fechaFin] = obtenerUltimosSeisMeses();

            const queryCreditosPendienteData = `
                SELECT 
                    ${tableACP03}.DIST03, 
                    ${tableACP03}.DESC03, 
                    ${tableACP03}.DIRE03, 
                    ${tableACP13}.NCTA13, 
                    ${tableACP05}.NNIT05, 
                    ${tableACP05}.DESC05, 
                    ${tableACP13}.FECI13, 
                    ${tableACP13}.TCRE13, 
                    ${tableACP13}.NCRE13, 
                    ${tableACP13}.NOCP13, 
                    ${tableACP13}.NANA13, 
                    ${tableACP13}.CAPI13, 
                    ${tableACP13}.TASA13,
                    ${tableACP13}.USEF13, 
                    ${tableACP05}.FECN05, 
                    ${tableACP06}.DESC06, 
                    ${tableACP06}.CLAS06, 
                    ${tableACP04}.DESC04
                FROM  
                    ${tableACP03}, 
                    ${tableACP04}, 
                    ${tableACP05}, 
                    ${tableACP06}, 
                    ${tableACP13}
                WHERE 
                    ${tableACP05}.NCTA05 = ${tableACP13}.NCTA13 
                    AND ${tableACP13}.TCRE13 = ${tableACP06}.TCRE06 
                    AND ${tableACP03}.DIST03 = ${tableACP05}.DIST05 
                    AND ${tableACP05}.NOMI05 = ${tableACP04}.NOMI04 
                    AND ${tableACP13}.SCAP13 >= 0
                    AND ${tableACP13}.TCRE13 NOT IN ('74', '90', '99','60')
                    AND ${tableACP13}.FECI13 BETWEEN ? AND ?
            `;

            let creditos = await executeQuery(queryCreditosPendienteData, [fechaInicio, fechaFin], 'AS400');

            // ✅ Consultar los Scores en la base de datos Pagares
            const queryScores = `SELECT cedula, Score FROM persona`;
            let scores = await executeQuery(queryScores, [], 'Pagares');

            // Mapear los scores por cédula
            let scoresMap = {};
            scores.forEach(persona => {
                scoresMap[String(parseInt(persona.cedula, 10))] = persona.Score;
            });

            // Agregar el Score a cada crédito pendiente
            creditos = creditos.map(credito => ({
                ...credito,
                Score: scoresMap[String(parseInt(credito.NNIT05, 10))] || 'F/D'
            }));

            return creditos;
        } catch (error) {
            console.error('❌ Error al obtener créditos pendientes:', error);
            throw error;
        }
    },

    async obtenerCreditosRegistrados() {
        try {
            const query = `
                SELECT CuentaCoop, ID_Pagare 
                FROM menu_datacredito.pagare
            `;
            const resultados = await executeQuery(query, [], 'PAGARES');
            return resultados;
        } catch (error) {
            console.error('❌ Error al obtener créditos registrados:', error);
            throw error;
        }
    },

    async obtenerCreditosNoRegistradosFinal() {
        try {
            // Obtener los créditos pendientes y los registrados
            let [creditosPendientes, creditosRegistrados] = await Promise.all([
                this.obtenerCreditosNoRegistrados(),
                this.obtenerCreditosRegistrados()
            ]);

            // Crear un conjunto (Set) con los registros ya pagados para comparación rápida
            const creditosRegistradosSet = new Set(
                creditosRegistrados.map(credito => `${credito.CuentaCoop}-${credito.ID_Pagare}`)
            );

            // Filtrar créditos especiales no registrados con validación doble para TCRE13 = 94
            const creditosEspecialesNoRegistrados = creditosPendientes.filter(credito => {
                let claveNCRE = `${credito.NCTA13}-${credito.NCRE13}`;
                let claveNOCP = `${credito.NCTA13}-${credito.NOCP13}`;

                if (credito.TCRE13 === '94') {
                    // Si NCRE13 no está registrado, verificar con NOCP13
                    return !creditosRegistradosSet.has(claveNCRE) && !creditosRegistradosSet.has(claveNOCP);
                } else {
                    // Para otros créditos, solo validar con NCRE13
                    return !creditosRegistradosSet.has(claveNCRE);
                }
            });

            return {
                CreditosEspecialesNoRegistrados: creditosEspecialesNoRegistrados
            };
        } catch (error) {
            console.error('❌ Error al obtener los créditos no registrados:', error);
            throw error;
        }
    }
};

module.exports = creditosNoRegistrados;
