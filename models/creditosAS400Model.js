const { executeQuery } = require('../config/db');

const creditosAS400 = {
    async getCreditosAS400(fechaInicio = null, fechaFin = null, agencia = null) {
        try {
            const [lapsoInicio, lapsoFin] = obtenerRangoFechasActual();
            const fechaInicioFinal = fechaInicio || lapsoInicio;
            const fechaFinFinal = fechaFin || lapsoFin;

            const tableACP03 = `COLIB.ACP03`;
            const tableACP04 = `COLIB.ACP04`;
            const tableACP05 = `COLIB.ACP05`;
            const tableACP06 = `COLIB.ACP06`;
            const tableACP13 = `COLIB.ACP13`;
            const tableACP16 = `COLIB.ACP16`;
            const tableACP23 = `COLIB.ACP23`;

            let filtroAgencia = '';
            const parametros = [fechaInicioFinal, fechaFinFinal];

            if (agencia) {
                filtroAgencia = ` AND ${tableACP13}.AGOP13 = ? `;
                parametros.push(agencia);
            }

            const queryCreditosData = `
                SELECT 
                    ${tableACP03}.DIRE03, 
                    ${tableACP13}.AGOP13, 
                    ${tableACP03}.DESC03, 
                    ${tableACP13}.NCTA13, 
                    ${tableACP05}.NNIT05, 
                    ${tableACP05}.DESC05, 
                    ${tableACP05}.NCTA05,
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
                    ${tableACP23}.STAT23, 
                    ${tableACP16}.CTRA16
                FROM 
                    ${tableACP03}, 
                    ${tableACP04}, 
                    ${tableACP05}, 
                    ${tableACP06}, 
                    ${tableACP13}, 
                    ${tableACP16}, 
                    ${tableACP23} 
                WHERE 
                    ${tableACP05}.NCTA05 = ${tableACP13}.NCTA13 
                    AND ${tableACP13}.TCRE13 = ${tableACP06}.TCRE06 
                    AND ${tableACP05}.NOMI05 = ${tableACP04}.NOMI04 
                    AND ${tableACP23}.NANA23 = ${tableACP13}.NANA13 
                    AND ${tableACP13}.NCTA13 = ${tableACP23}.NCTA23 
                    AND ${tableACP13}.AGOP13 = ${tableACP03}.DIST03 
                    AND ${tableACP13}.NCRE13 = ${tableACP16}.NCRE16 
                    AND ${tableACP13}.NCTA13 = ${tableACP16}.NCTA16 
                    AND ${tableACP13}.TCRE13 <> '74'
                    AND ${tableACP13}.FECI13 BETWEEN ? AND ?                     
                    ${filtroAgencia}
            `;

            let creditos = await executeQuery(queryCreditosData, parametros);

            const queryScores = `SELECT cedula, Score FROM persona`;
            const scores = await executeQuery(queryScores, [], 'Pagares');

            const scoresMap = {};
            scores.forEach(persona => {
                scoresMap[String(parseInt(persona.cedula, 10))] = persona.Score;
            });

            const queryEstados = `
                SELECT cuenta, pagare, estado, MedioPago, fecha_pago, motivo, usuario_pagador
                FROM creditos_pagados
            `;
            const estados = await executeQuery(queryEstados, [], 'Pagares');

            const estadoMap = {};
            estados.forEach(e => {
                const key = `${e.cuenta}-${e.pagare}`;
                estadoMap[key] = {
                    estado: e.estado,
                    medioPago: e.MedioPago,
                    fecha_pago: e.fecha_pago,
                    motivo: e.motivo,
                    usuario_pagador: e.usuario_pagador
                };
            });

            creditos = creditos.map(credito => {
                const key = `${credito.NCTA13}-${credito.NCRE13}`;
                const estadoData = estadoMap[key];

                return {
                    ...credito,
                    Score: scoresMap[String(parseInt(credito.NNIT05, 10))] || 'F/D',
                    Estado: estadoData ? estadoData.estado : 'Desconocido',
                    MedioPago: estadoData ? estadoData.medioPago : 'No registrado',
                    fecha_pago: estadoData ? estadoData.fecha_pago : 'No registrado',
                    motivo: estadoData ? estadoData.motivo : 'No registrado',
                    usuario_pagador: estadoData ? estadoData.usuario_pagador : 'No registrado'
                };
            });

            return creditos;
        } catch (error) {
            console.error('Error al obtener créditos:', error);
            throw error;
        }
    },

    async contarCreditosAS400() {
        try {

            // Obtener el primer día del mes y la fecha actual
            const [lapsoInicio, lapsoFin] = obtenerRangoFechasActual();

            const queryCount = `
          SELECT COUNT(*) AS TOTAL
            FROM COLIB.ACP13
            WHERE CAPI13 > 0
            AND TCRE13 NOT IN ('60', '74')
            AND FECI13 BETWEEN ? AND ?
            `;
            const result = await executeQuery(queryCount, [lapsoInicio, lapsoFin]);

            return result[0]?.['TOTAL'] || 0;
        } catch (error) {
            console.error('Error al contar los créditos:', error);
            throw error;
        }

    },

    async registrarAuditoriaCre({ nombre_usuario, rol, ip_usuario, detalle_actividad }) {
        const query = `
            INSERT INTO conciliacion_auditoria 
            (nombre_usuario, rol, ip_usuario, fecha_acceso, hora_acceso, detalle_actividad) 
            VALUES (?, ?, ?, NOW(), NOW(), ?)
        `;

        await executeQuery(query, [nombre_usuario, rol, ip_usuario, detalle_actividad
        ], 'PAGARES');

    },
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



module.exports = creditosAS400;

